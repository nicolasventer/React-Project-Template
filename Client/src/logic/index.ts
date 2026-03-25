import { localStorageLogic } from "@/localStorage";
import { colorScheme } from "@/logic/colorsScheme";
import { config } from "@/logic/config";
import { lang } from "@/logic/lang";
import { route } from "@/logic/route";
import { todos } from "@/logic/todos";
import { tr } from "@/logic/tr";

// Use "app" instead of "logic" since it's shorter.
export const app = {
	colorScheme: colorScheme,
	config: config,
	lang: lang,
	route: route,
	todos: todos,
	tr: tr,
	localStorage: localStorageLogic,
};
