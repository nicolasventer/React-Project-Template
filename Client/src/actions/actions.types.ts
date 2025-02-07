export type ViewportSize = {
	height: number;
	width: number;
};

export type ConsoleType = "normal" | "custom" | "both";

export type LogType = "log" | "info" | "warn" | "error";

export type Log = {
	type: LogType;
	time: string; // format: HH:mm:ss.SSS
	message: string;
};
