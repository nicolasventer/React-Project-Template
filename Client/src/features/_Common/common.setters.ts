import { closeHeight, maxConsoleHeight, openHeight } from "@/features/_Common/common.getters";
import { globalState, isLanguageLoading, loadGlobalState, LOCAL_STORAGE_KEY } from "@/globalState";
import type { ColorSchemeType, LanguageType, LogType } from "@/Shared/SharedModel";
import type { Signal } from "@preact/signals";

// MainLayout

/**
 * Set the isAboveMd global state.
 * @param isAboveMd the value to set
 */
export const setIsAboveMd = (isAboveMd: boolean) => void (globalState.isAboveMd.value = isAboveMd);
/**
 * Set the isBelowXxs global state.
 * @param isBelowXxs the value to set
 */
export const setIsBelowXxs = (isBelowXxs: boolean) => void (globalState.isBelowXxs.value = isBelowXxs);
/**
 * Set the viewport size global state.
 * @param params
 * @param params.height the height to set
 * @param params.width the width to set
 */
export const setViewportSize = ({ height, width }: { height: number; width: number }) =>
	void (globalState.viewportSize.value = { height, width });

// CustomConsole

/**
 * Resize the console. \
 * If the new height is less than the close height, the console is hidden. \
 * If the new height is more than the open height, the console is displayed.
 * @param newHeight The new height of the console.
 * @param startConsoleHeight The start height of the console.
 */
export const resizeConsole = (newHeight: number, startConsoleHeight: number) => {
	globalState.consoleHeight.value = Math.max(openHeight.value, Math.min(maxConsoleHeight.value, newHeight));
	if (newHeight <= closeHeight.value) {
		globalState.isConsoleDisplayed.value = false;
		globalState.consoleHeight.value = startConsoleHeight;
	} else if (newHeight >= openHeight.value) {
		globalState.isConsoleDisplayed.value = true;
		globalState.logToSeeCount.value = 0;
	}
};

/**
 * Update the log to see count.
 * @param index The index of the last log already seen.
 */
export const updateLogToSeeCount = (index: number) =>
	(globalState.logToSeeCount.value = globalState.logList.value.length - index - 1);

/** Toggle the console display. If the console is displayed, the log to see count is reset. */
export const toggleConsole = () => {
	globalState.isConsoleDisplayed.value = !globalState.isConsoleDisplayed.value;
	if (globalState.isConsoleDisplayed.value) globalState.logToSeeCount.value = 0;
};

/** Clear the console. */
export const clearConsole = () => {
	globalState.logList.value = [];
	globalState.logToSeeCount.value = 0;
};

/**
 * Add a log to the console.
 * @param type the type of the log
 * @param message the message of the log
 */
export const addConsoleLog = (type: LogType, message: string) => {
	globalState.logList.value = [
		...globalState.logList.peek(),
		{
			type,
			message,
			time: new Date().toISOString().split("T")[1],
		},
	];
	globalState.logToSeeCount.value = globalState.logToSeeCount.peek() + 1;
};

// WakeLockButton

/**
 * Set the wake lock.
 * @param isWakeLock value to set
 */
export const setWakeLock = (isWakeLock: boolean) => (globalState.isWakeLock.value = isWakeLock);

// DarkModeButton

/**
 * Set the color scheme. If useTransition is true, the color scheme is set with a transition.
 * @param colorScheme the color scheme to set
 * @param useTransition whether to use the document transition API
 * @param isColorSchemeLoading the signal to update when the color scheme is loading
 */
export const setColorSchemeFn =
	(colorScheme: ColorSchemeType, useTransition: boolean, isColorSchemeLoading: Signal<boolean>) => () => {
		if (useTransition) {
			document.startViewTransition(() => (globalState.colorScheme.value = colorScheme));
		} else {
			isColorSchemeLoading.value = true;
			setTimeout(() => {
				globalState.colorScheme.value = colorScheme;
				isColorSchemeLoading.value = false;
			}, 100);
		}
	};

// LanguageButton

/**
 * Set the language. If useTransition is true, the language is set with a transition.
 * @param language the language to set
 * @param useTransition whether to use the document transition API
 */
export const setLanguageFn = (language: LanguageType, useTransition: boolean) => () => {
	if (useTransition) {
		document.startViewTransition(() => (globalState.language.value = language));
	} else {
		isLanguageLoading.value = true;
		setTimeout(() => {
			globalState.language.value = language;
			isLanguageLoading.value = false;
		}, 100);
	}
};

// ImportDataButton

/**
 * Import the global state data from a JSON string.
 * @param readData the JSON string to import
 * @param onSuccess the function to call when the data is imported
 */
export const importData = (readData: string, onSuccess: () => void) => {
	try {
		const data = JSON.parse(readData); // check that readData is a JSON string
		localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(data));
		const newGlobalState = loadGlobalState();
		Object.assign(globalState, newGlobalState);
		onSuccess();
	} catch (error) {
		console.error(error);
	}
};
