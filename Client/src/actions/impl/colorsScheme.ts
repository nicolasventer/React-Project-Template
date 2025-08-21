import { app } from "@/globalState";
import type { ColorSchemeType } from "@/Shared/SharedModel";
import { wait } from "@/Shared/SharedUtils";

const _updateColorSchemeValue = (colorScheme: ColorSchemeType) => {
	app.colorScheme.data.setValue(colorScheme);
	app.colorScheme.isLoading.setValue(false);
};

const updateColorSchemeFn = (colorScheme: ColorSchemeType, useTransition: boolean) => () => {
	if (useTransition) {
		document.startViewTransition(() => _updateColorSchemeValue(colorScheme));
		return Promise.resolve();
	} else {
		app.colorScheme.isLoading.setValue(true);
		return wait(200).then(() => _updateColorSchemeValue(colorScheme));
	}
};

export const colorScheme = { updateFn: updateColorSchemeFn };
