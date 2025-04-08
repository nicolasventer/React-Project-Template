import type { Log, ViewportSize } from "@/actions/actions.types";
import { globalState } from "@/globalState";
import { signalArray } from "@/utils/signalUtils";
import { signal } from "@preact/signals";

export const state = {
	colorScheme: {
		current: globalState.colorScheme,
		isLoading: signal(false),
	},
	language: {
		current: globalState.language,
		isLoading: globalState.isLanguageLoading,
	},
	console: {
		isDisplayed: globalState.isConsoleDisplayed,
		height: globalState.consoleHeight,
		isResizing: signal(false),
		log: {
			list: signalArray<Log>([]),
			toSeeCount: signal(0),
			isWrapped: signal(false),
		},
	},
	wakeLock: {
		isEnabled: signal(false),
		isLoading: signal(false),
	},
	viewportSize: signal<ViewportSize>({ height: 0, width: 0 }),
	errorMessage: signal<string | null>(null),
};

const catchErrorFn = (path: string, bThrow: boolean) => (error: unknown) => {
	console.log(`${path} error:`, error);
	state.errorMessage.value =
		typeof error === "object" && error && "message" in error ? (error.message as string) : "Unknown error";
	if (bThrow) throw error;
};

/**
 * Logs the error and updates `state.errorMessage` before and optionally after the execution of the promise. \
 * Careful: if bThrow is false and an error occurs, neither then, nor catch, nor finally, nor await will be executed.
 * @param path the path of the function that called the promise
 * @param promise the promise to handle
 * @param bThrow if true, the error is rethrown
 * @returns if bThrow is true, the result of the promise, otherwise nothing
 */
const handleError_ = <T>(path: string, promise: Promise<T>, bThrow: boolean) =>
	new Promise<T>((resolve, reject) => {
		state.errorMessage.value = null;
		promise.then(resolve).catch(catchErrorFn(path, bThrow)).catch(reject);
	});

/**
 * Logs the error and updates `state.errorMessage` before and optionally after the execution of the promise. \
 * Careful: if an error occurs, neither then, nor catch, nor finally, nor await will be executed.
 * @param path the path of the function that called the promise
 * @param promise the promise to handle
 * @returns nothing
 */
export const handleError = (path: string, promise: Promise<unknown>): void => void handleError_(path, promise, false);

/**
 * Logs the error and updates `state.errorMessage` before and optionally after the execution of the promise.
 * @param path the path of the function that called the promise
 * @param promise the promise to handle
 * @returns the result of the promise if successful, otherwise the error is logged and rethrown
 */
export const handleErrorWithThrow = <T>(path: string, promise: Promise<T>) => handleError_(path, promise, true);
