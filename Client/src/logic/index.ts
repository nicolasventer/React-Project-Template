import { localStorageLogic } from "@/localStorage";
import { colorScheme } from "@/logic/colorsScheme";
import { config } from "@/logic/config";
import { lang } from "@/shared/logic/lang";
import { route } from "@/shared/logic/route";
import { tr } from "@/shared/logic/tr";

// Use "app" instead of "logic" since it's shorter.
export const app = {
	colorScheme: colorScheme,
	config: config,
	lang: lang,
	route: route,
	tr: tr,
	localStorage: localStorageLogic,
};
