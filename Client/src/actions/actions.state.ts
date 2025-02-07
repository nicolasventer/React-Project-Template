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
};

export const computedState = {
	closeHeight: computed(() => state.viewportSize.value.height * 0.05),
	openHeight: computed(() => state.viewportSize.value.height * 0.15),
	maxConsoleHeight: computed(() => state.viewportSize.value.height * 0.5),
};
