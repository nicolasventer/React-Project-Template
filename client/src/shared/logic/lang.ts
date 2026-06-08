import { getLocalStorageKey } from "@/shared/Config";
import type { Lang } from "@/shared/types/Lang";
import { localStorageStore, store } from "@/shared/utils/Store";
import { wait } from "@/shared/utils/utils";

const state = {
	data: localStorageStore<Lang>(getLocalStorageKey("lang"), "en"),
	isLoading: store(false),
};

const _updateLangValue = (lang: Lang) => {
	state.data.setValue(lang);
	state.isLoading.setValue(false);
};

const updateLangFn = (lang: Lang, useTransition: boolean) => () => {
	if (useTransition) {
		document.startViewTransition(() => _updateLangValue(lang));
		return Promise.resolve();
	} else {
		state.isLoading.setValue(true);
		return wait(200).then(() => _updateLangValue(lang));
	}
};

export const lang = {
	...state,
	fn: {
		updateFn: updateLangFn,
	},
};
