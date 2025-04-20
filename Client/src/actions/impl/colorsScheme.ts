import { setAppWithUpdate } from "@/globalState";
import type { ColorSchemeType } from "@/Shared/SharedModel";
import { wait } from "@/Shared/SharedUtils";

const updateColorSchemeLoading = (colorScheme: ColorSchemeType, useTransition: boolean) =>
	setAppWithUpdate("updateColorSchemeLoading", [colorScheme, useTransition], (prev) => (prev.colorScheme.isLoading = true));
const updateColorSchemeValue = (colorScheme: ColorSchemeType, useTransition: boolean) =>
	setAppWithUpdate("updateColorSchemeValue", [colorScheme, useTransition], (prev) => {
		prev.colorScheme.isLoading = false;
		prev.colorScheme.value = colorScheme;
	});
const updateColorSchemeFn = (colorScheme: ColorSchemeType, useTransition: boolean) => () => {
	if (useTransition) {
		updateColorSchemeLoading(colorScheme, useTransition);
		return wait(200).then(() => updateColorSchemeValue(colorScheme, useTransition));
	} else {
		document.startViewTransition(() => updateColorSchemeValue(colorScheme, useTransition));
		return Promise.resolve();
	}
};

export const colorScheme = { updateFn: updateColorSchemeFn };
