import { Notice } from "obsidian";

import { io, Socket } from "socket.io-client";
const uuid = require("uuid");

import { writeFileData, getFileDiff } from "./fileUtils";
import { MAX_RECONNECTION_ATTEMPTS, CONNECTION_STATUS } from "./constants";
import LiveSharePlugin from "main";

interface ServerToClientEvents {
	active_users: (data: { users: string[] }) => void;
	user_connected: (data: { uuid: string; users: string[] }) => void;
	user_disconnected: (data: { uuid: string; users: string[] }) => void;
	file_data: (data: {
		filePath: string;
		fileData: { line: number; text: string }[];
	}) => void;
	cursor_move: (data: {
		from: { line: number; ch: number };
		to: { line: number; ch: number };
	}) => void;
}

interface ClientToServerEvents {
	file_data: (data: unknown) => void;
	cursor_move: (data: {
		from: { line: number; ch: number };
		to: { line: number; ch: number };
	}) => void;
}

export default class LiveShareClient {
	plugin: LiveSharePlugin;
	connectionStatusBar: HTMLElement;
	activeStatusBar: HTMLElement;
	connectionStatusClass: string;
	connectionStatus: string;
	uuid: string;
	socket: Socket<ServerToClientEvents, ClientToServerEvents>;
	cursorLastFrom: { line: number; ch: number };
	cursorLastTo: { line: number; ch: number };
	oldFileData: string;

	constructor(plugin: LiveSharePlugin) {
		this.plugin = plugin;
		this.connectionStatusBar = this.plugin.addStatusBarItem();
		this.activeStatusBar = this.plugin.addStatusBarItem();
		this.connectionStatusClass = "";
		this.cursorLastFrom = { line: 0, ch: 0 };
		this.cursorLastTo = { line: 0, ch: 0 };
		this.oldFileData = "";
		this.uuid = uuid.v4();

		//Set default statuses
		this.setConnectionStatus(CONNECTION_STATUS.DISCONNECTED);
		this.setNumActiveUsers();

		console.log(this.plugin.settings.serverUrl);
		
		//Setup our socket
		this.socket = io(this.plugin.settings.serverUrl, {
			autoConnect: this.plugin.settings.connectOnLoad,
			reconnectionAttempts: MAX_RECONNECTION_ATTEMPTS,
			auth: {
				uuid: this.uuid,
			},
		});
		this.socket.on("connect", () => {
			new Notice("Connected to the live share server!");
			this.setConnectionStatus(CONNECTION_STATUS.CONNECTED);
		});

		this.socket.on("disconnect", () => {
			new Notice("Disconnected from live share server.");
			this.setConnectionStatus(CONNECTION_STATUS.DISCONNECTED);
			this.setNumActiveUsers();
		});

		this.socket.on("active_users", (data) => {
			this.setNumActiveUsers(data.users.length);
			console.log("Active users: %s", data.users);
		});

		this.socket.on("user_connected", (data) => {
			new Notice(`${data.uuid} connected.`);
			console.log("%s connected", data.uuid);
			this.setNumActiveUsers(data.users.length);
		});

		this.socket.on("user_disconnected", (data) => {
			new Notice(`${data.uuid} disconnected.`);
			console.log("%s disconnected", data.uuid);
			this.setNumActiveUsers(data.users.length);
		});

		this.socket.on("file_data", (data) => {
			console.log("Received file data");
			console.log(data);
			writeFileData(
				`${this.plugin.settings.vaultPath}/${data.filePath}`,
				this.oldFileData,
				data.fileData
			);
		});

		this.socket.on("cursor_move", (data) => {
			console.log("Received cursor move: %s", data);
		});

		this.socket.io.on("reconnect_attempt", (attempt) => {
			if (attempt === MAX_RECONNECTION_ATTEMPTS) {
				new Notice("Cannot to the live share server.");
				this.setConnectionStatus(CONNECTION_STATUS.DISCONNECTED);
			} else {
				new Notice("Attempting to connect to the live share server.");
				this.setConnectionStatus(CONNECTION_STATUS.RECONNECTING);
			}
		});

		this.plugin.addRibbonIcon("forward-arrow", "Live share vault", (evt) =>
			this.connect()
		);
	}

	connect() {
		if (this.connectionStatus === CONNECTION_STATUS.DISCONNECTED) {
			this.setConnectionStatus(CONNECTION_STATUS.CONNECTING);
			this.socket.connect();
		}
	}

	disconnect() {
		if (this.connectionStatus === CONNECTION_STATUS.CONNECTED) {
			//The true value means don't reconnect on disconnect
			this.socket.disconnect();
		}
	}

	isConnected() {
		return this.connectionStatus === CONNECTION_STATUS.CONNECTED;
	}

	async onFileModified(filePath: string, data: string) {
		if (this.connectionStatus === CONNECTION_STATUS.CONNECTED) {
			//If the user hasn't changed any text, then don't emit any data
			const diff = getFileDiff(this.oldFileData, data);
			if (diff.length > 0) {
				this.oldFileData = data;
				this.socket.emit("file_data", {
					filePath,
					fileData: diff,
				});
			}
		}
	}

	onCursorMove(
		from: { line: number; ch: number },
		to: { line: number; ch: number }
	) {
		if (this.connectionStatus === CONNECTION_STATUS.CONNECTED) {
			if (
				this.cursorLastFrom.line !== from.line ||
				this.cursorLastFrom.ch !== from.ch ||
				this.cursorLastTo.line !== to.line ||
				this.cursorLastTo.ch !== to.ch
			) {
				//Set old step
				this.cursorLastFrom = from;
				this.cursorLastTo = to;
				this.socket.emit("cursor_move", {
					from,
					to,
				});
			}
		}
	}

	setNumActiveUsers(numActive = 0) {
		if (numActive > 0) this.activeStatusBar.setText(`${numActive} Active`);
		else this.activeStatusBar.setText("");
	}

	setConnectionStatus(status: string) {
		this.connectionStatus = status;
		this.connectionStatusBar.setText(status);

		if (this.connectionStatusClass !== "")
			this.connectionStatusBar.removeClass(this.connectionStatusClass);
		this.connectionStatusClass = this.findConnectionStatusClass(status);
		this.connectionStatusBar.addClass(this.connectionStatusClass);
	}

	findConnectionStatusClass(status: string) {
		switch (status) {
			case CONNECTION_STATUS.DISCONNECTED:
				return "obsidian-live-share__connection-status-bar--disconnected";
			case CONNECTION_STATUS.CONNECTING:
				return "obsidian-live-share__connection-status-bar--connecting";
			case CONNECTION_STATUS.RECONNECTING:
				return "obsidian-live-share__connection-status-bar--reconnecting";
			case CONNECTION_STATUS.CONNECTED:
				return "obsidian-live-share__connection-status-bar--connected";
			default:
				return "";
		}
	}
}
