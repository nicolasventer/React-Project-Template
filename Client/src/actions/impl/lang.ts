import type { Lang } from "@/dict";
import { setAppWithUpdate } from "@/globalState";
import { wait } from "@/Shared/SharedUtils";

const updateLangLoading = (lang: Lang, useTransition: boolean) =>
	setAppWithUpdate("updateLangLoading", [lang, useTransition], (prev) => (prev.lang.isLoading = true));
const updateLangValue = (lang: Lang) =>
	setAppWithUpdate("updateLangValue", [lang], (prev) => {
		prev.lang.isLoading = false;
		prev.lang.value = lang;
	});
const updateLangFn = (lang: Lang, useTransition: boolean) => () => {
	if (useTransition) {
		updateLangLoading(lang, useTransition);
		return wait(200).then(() => updateLangValue(lang));
	} else {
		document.startViewTransition(() => updateLangValue(lang));
		return Promise.resolve();
	}
};

export const lang = { updateFn: updateLangFn };
