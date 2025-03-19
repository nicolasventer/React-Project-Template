import type { Log, ViewportSize } from "@/actions/actions.types";
import { globalState } from "@/globalState";
import { signalArray } from "@/utils/signalUtils";
import { computed, signal } from "@preact/signals";

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

export const computedState = {
	closeHeight: computed(() => state.viewportSize.value.height * 0.05),
	openHeight: computed(() => state.viewportSize.value.height * 0.15),
	maxConsoleHeight: computed(() => state.viewportSize.value.height * 0.5),
};

/**
 * Logs the error and updates `state.errorMessage` before and optionally after the execution of the promise
 * @param path the path of the function that called the promise
 * @param promise the promise to handle
 * @param bThrow if true, the error is rethrown (default: false)
 * @returns the result of the promise if successful, otherwise the error is NOT rethrown
 */
export const handleError = <T>(path: string, promise: Promise<T>, bThrow = false) =>
	new Promise<T>((resolve, reject) => {
		state.errorMessage.value = null;
		promise.then(resolve).catch((error) => {
			console.log(`${path} error:`, error);
			state.errorMessage.value =
				typeof error === "object" && error && "message" in error ? (error.message as string) : "Unknown error";
			if (bThrow) reject(error);
		});
	});
