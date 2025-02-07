import type { IColorScheme } from "@/actions/actions.interface";
import { state } from "@/actions/actions.state";
import type { ColorSchemeType } from "@/Shared/SharedModel";

export class ColorSchemeImpl implements IColorScheme {
	updateFn = (colorScheme: ColorSchemeType, useTransition: boolean) => () => {
		if (useTransition) {
			document.startViewTransition(() => (state.colorScheme.current.value = colorScheme));
		} else {
			state.colorScheme.isLoading.value = true;
			setTimeout(() => {
				state.colorScheme.current.value = colorScheme;
				state.colorScheme.isLoading.value = false;
			}, 100);
		}
	};
}
