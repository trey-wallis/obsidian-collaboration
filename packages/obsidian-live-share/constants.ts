export interface ConnectionStatus {
	DISCONNECTED: string,
	CONNECTING: string,
	RECONNECTING: string,
	CONNECTED: string
}

export const CONNECTION_STATUS: ConnectionStatus = {
	DISCONNECTED: "Disconnected",
	CONNECTING: "Connecting...",
	RECONNECTING: "Reconnecting...",
	CONNECTED: "Live Sharing",
};

export const MAX_RECONNECTION_ATTEMPTS = 5;