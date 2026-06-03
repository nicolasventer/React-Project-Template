import type { Lang } from "@/shared/dict";
import { store } from "@/utils/Store";
import { wait } from "@/utils/utils";

const state = {
	data: store<Lang>("en"),
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
