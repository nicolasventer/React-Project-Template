import type { ColorSchemeType } from "@/app/types/ColorScheme.type";
import { store } from "@/shared/utils/Store";
import { wait } from "@/shared/utils/utils";

const state = {
	data: store<ColorSchemeType>("light"),
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
	...state,
	fn: {
		updateFn: updateColorSchemeFn,
	},
};
