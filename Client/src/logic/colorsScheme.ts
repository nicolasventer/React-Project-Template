import { initialLocalStorageState } from "@/localStorage";
import type { ColorSchemeType } from "@/types/ColorScheme.type";
import { store } from "@/utils/Store";
import { wait } from "@/utils/utils";

const state = {
	data: store(initialLocalStorageState.colorScheme),
	isLoading: store(false),
};

const _updateColorSchemeValue = (colorScheme: ColorSchemeType) => {
	state.data.setValue(colorScheme);
	state.isLoading.setValue(false);
};

const updateColorSchemeFn = (colorScheme: ColorSchemeType, useTransition: boolean) => () => {
	if (useTransition) {
		document.startViewTransition(() => _updateColorSchemeValue(colorScheme));
		return Promise.resolve();
	} else {
		state.isLoading.setValue(true);
		return wait(200).then(() => _updateColorSchemeValue(colorScheme));
	}
};

export const colorScheme = {
	state: state,
	fn: {
		updateFn: updateColorSchemeFn,
	},
};
