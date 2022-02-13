import { Plugin, MarkdownView } from "obsidian";
import { LiveShareSettingsTab } from "./settings";

import LiveShareClient from "./client";
interface LiveShareSettings {
	serverUrl: string;
	vaultPath: string;
	connectOnLoad: boolean;
}

const DEFAULT_SETTINGS: LiveShareSettings = {
	serverUrl: "http://localhost:8000",
	vaultPath: "/path/to/my/vault",
	connectOnLoad: false,
};

export default class LiveSharePlugin extends Plugin {
	settings: LiveShareSettings;
	client: LiveShareClient = null;
	userEdited: boolean;

	async onload() {
		await this.loadSettings();

		this.client = new LiveShareClient(this);

		this.addCommand({
			id: "connect-to-live-share-server",
			name: "Connect to server",
			callback: () => {
				this.client.connect();
			},
		});

		this.addCommand({
			id: "disconnect-to-live-share-server",
			name: "Disconnect from server",
			callback: () => {
				this.client.disconnect();
			},
		});

		const getFileText = () => {
			const view = this.app.workspace.getActiveViewOfType(MarkdownView);
			//If we're on the markdown view
			if (view !== null) {
				const filePath = view.file.path;
				const data = view.getViewData();

				//If we're edited since the last time the file was modified
				if (this.userEdited) {
					this.userEdited = false;
					this.client.onFileModified(filePath, data);
					console.log("Sending changes!!");
				}
			}
		};

		const getEphemeralState = () => {
			const view = this.app.workspace.getActiveViewOfType(MarkdownView);
			//If we're on the markdown view
			if (view !== null) {
				const state = view.getEphemeralState();
				//If our cursor is on the screen
				if (state.cursor !== undefined)
					this.client.onCursorMove(
						state.cursor.from,
						state.cursor.to
					);
			}
		};

		this.addSettingTab(new LiveShareSettingsTab(this.app, this));

		this.registerDomEvent(document, 'keydown', (evt: KeyboardEvent) => {
			//When we type something set edited to true
			this.userEdited = true;
		});

		this.registerInterval(
			window.setInterval(() => getEphemeralState(), 1500)
		);

		this.registerInterval(window.setInterval(() => getFileText(), 1500));
	}

	onunload() {
		this.client.disconnect();
	}

	async loadSettings() {
		this.settings = Object.assign(
			{},
			DEFAULT_SETTINGS,
			await this.loadData()
		);
	}

	async saveSettings() {
		await this.saveData(this.settings);
	}
}
