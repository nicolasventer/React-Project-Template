import type { ILanguage } from "@/actions/actions.interface";
import { state } from "@/actions/actions.state";
import type { LanguageType } from "@/Shared/SharedModel";

export class LanguageImpl implements ILanguage {
	updateFn = (language: LanguageType, useTransition: boolean) => () => {
		if (useTransition) {
			document.startViewTransition(() => (state.language.current.value = language));
		} else {
			state.language.isLoading.value = true;
			setTimeout(() => {
				state.language.current.value = language;
				state.language.isLoading.value = false;
			}, 100);
		}
	};
}
