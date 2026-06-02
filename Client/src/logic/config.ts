import type { Config } from "@/config/cliConfig";
import { DEFAULT_CONFIG } from "@/config/cliConfig";
import { initialLocalStorageState } from "@/localStorage";
import { store } from "@/utils/Store";

const state = {
	data: store<Config>(initialLocalStorageState.config),
};

const _displayKeys = () => {
	console.log("Available keys:", Object.keys(state.data.value));
	return false;
};

const displayConfigValue = (key: keyof Config) => {
	if (!(key in state.data.value)) return _displayKeys();
	console.log(`${key}: ${state.data.value[key]}`);
	return true;
};

const displayAllConfigValues = () => {
	console.log(state.data.value);
	return true;
};

const updateConfigValue = (key: keyof Config, value: Config[keyof Config]) => {
	if (!(key in state.data.value)) return _displayKeys();
	state.data.setValue((prev) => ({ ...prev, [key]: value }));
	return true;
};

const resetConfigValue = (key: keyof Config) => {
	if (!(key in state.data.value)) return _displayKeys();
	state.data.setValue((prev) => ({ ...prev, [key]: DEFAULT_CONFIG[key] }));
	return true;
};

const resetAllConfigValues = () => {
	state.data.setValue(DEFAULT_CONFIG);
	return true;
};

export const config = {
	...state,
	fn: {
		value: {
			display: displayConfigValue,
			displayAll: displayAllConfigValues,
			update: updateConfigValue,
			reset: resetConfigValue,
			resetAll: resetAllConfigValues,
		},
	},
};

declare global {
	interface Window {
		config: typeof config.fn.value;
	}
}

// expose config display and update
window.config = config.fn.value;
