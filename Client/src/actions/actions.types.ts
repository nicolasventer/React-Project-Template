export type ViewportSize = {
	height: number;
	width: number;
};

export const CONSOLE_TYPES = ["normal", "custom", "both"] as const;
export type ConsoleType = (typeof CONSOLE_TYPES)[number];

export const LOG_TYPES = ["log", "info", "warn", "error"] as const;
export type LogType = (typeof LOG_TYPES)[number];

export type Log = {
	type: LogType;
	time: string; // format: HH:mm:ss.SSS
	message: string;
};
