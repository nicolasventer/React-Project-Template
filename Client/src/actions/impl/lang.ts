import type { Lang } from "@/dict";
import { app } from "@/globalState";
import { wait } from "@/Shared/SharedUtils";

const _updateLangValue = (lang: Lang) => {
	app.lang.data.setValue(lang);
	app.lang.isLoading.setValue(false);
};

const updateLangFn = (lang: Lang, useTransition: boolean) => () => {
	if (useTransition) {
		document.startViewTransition(() => _updateLangValue(lang));
		return Promise.resolve();
	} else {
		app.lang.isLoading.setValue(true);
		return wait(200).then(() => _updateLangValue(lang));
	}
};

export const lang = { updateFn: updateLangFn };
