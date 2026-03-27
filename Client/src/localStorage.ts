import type { Config } from "@/config/cliConfig";
import { DEFAULT_CONFIG } from "@/config/cliConfig";
import type { Lang } from "@/dict";
import type { ColorSchemeType } from "@/types/ColorScheme.type";
import type { Todo } from "@/types/Todo.type";

const LOCAL_STORAGE_KEY = "template_globalState" as const;

export type LocalStorageState = {
	lang: Lang;
	colorScheme: ColorSchemeType;
	todos: Todo[];
	config: Config;
};
const _loadLocalStorageState = (): LocalStorageState => {
	const storedLocalStorageState = JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEY) ?? "{}") as Partial<LocalStorageState>;
	return {
		lang: storedLocalStorageState.lang ?? "en",
		colorScheme: storedLocalStorageState.colorScheme ?? "light",
		todos: storedLocalStorageState.todos ?? [],
		config: storedLocalStorageState.config ?? DEFAULT_CONFIG,
	};
};
export const initialLocalStorageState = _loadLocalStorageState();

const updateLocalStorageState = (localStorageState: LocalStorageState) => {
	localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(localStorageState));
};

// not placed in logic since dependencies and usage differs from other logic modules
export const localStorageLogic = {
	// state: _state, // intentionally not exported, use initialLocalStorageState or update with app.localStorage.update
	update: updateLocalStorageState,
};
