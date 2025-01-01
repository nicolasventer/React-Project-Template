import { addConsoleLog } from "@/features/_Common/common.setters";
import type { LogType } from "@/Shared/SharedModel";

const oldConsoleLog = console.log;
const oldConsoleInfo = console.info;
const oldConsoleWarn = console.warn;
const oldConsoleError = console.error;

const newConsoleLogFn =
	(type: LogType) =>
	(...args: unknown[]) =>
		addConsoleLog(
			type,
			args
				.map((arg) =>
					typeof arg === "string" ? arg : arg instanceof Error ? `${arg.message}\n${arg.stack}` : JSON.stringify(arg)
				)
				.join(" ")
		);

/**
 * Type of the console: normal for the default console, custom for the custom console, both for both.
 */
export type ConsoleType = "normal" | "custom" | "both";

/**
 * Update the functions `console.log`, `console.info`, ... according to the given type.
 * @param type the type of the console
 */
export const setConsoleType = (type: ConsoleType) => {
	if (type === "normal") {
		console.log = oldConsoleLog;
		console.info = oldConsoleInfo;
		console.warn = oldConsoleWarn;
		console.error = oldConsoleError;
	} else if (type === "custom") {
		console.log = newConsoleLogFn("log");
		console.info = newConsoleLogFn("info");
		console.warn = newConsoleLogFn("warn");
		console.error = newConsoleLogFn("error");
	} else {
		console.log = (...args: unknown[]) => (oldConsoleLog(...args), newConsoleLogFn("log")(...args));
		console.info = (...args: unknown[]) => (oldConsoleInfo(...args), newConsoleLogFn("info")(...args));
		console.warn = (...args: unknown[]) => (oldConsoleWarn(...args), newConsoleLogFn("warn")(...args));
		console.error = (...args: unknown[]) => (oldConsoleError(...args), newConsoleLogFn("error")(...args));
	}
};
