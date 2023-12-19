import { computed, effect, signal, Signal } from "@preact/signals";
import type { ColorSchemeType, DynDict, LanguageType, Log, TranslationCategoryType } from "../Common/CommonModel";
import type { Tr } from "../tr/en";
import type { SignalToValue } from "../utils/signalUtils";

/** The type of the global state of the application. */
export type GlobalState = {
	/** the color scheme of the application */
	colorScheme: Signal<ColorSchemeType>;
	/** the language of the application */
	language: Signal<LanguageType>;
	/** if the console is displayed */
	isConsoleDisplayed: Signal<boolean>;
	/** the height of the console */
	consoleHeight: Signal<number>;
	/** the list of logs */
	logList: Signal<Log[]>;
	/** the number of logs to see */
	logToSeeCount: Signal<number>;
	/** @ignore */
	tr: Signal<Tr>;
	/** the dynamic translation object */
	trDynDict: Signal<DynDict>;
	/** if the screen is wake locked */
	isWakeLock: Signal<boolean>;
	/** if the screen is above md */
	isAboveMd: Signal<boolean>;
	/** if the screen is below xxs */
	isBelowXxs: Signal<boolean>;
	/** the size of the viewport */
	viewportSize: Signal<{
		/** the height of the viewport */
		height: number;
		/** the width of the viewport */
		width: number;
	}>;
};

type LocalStorageState = SignalToValue<Pick<GlobalState, "colorScheme" | "language" | "isConsoleDisplayed" | "consoleHeight">>;

const loadGlobalState = (): GlobalState => {
	const storedGlobalState = JSON.parse(localStorage.getItem("globalState") ?? "{}") as Partial<SignalToValue<LocalStorageState>>;

	return {
		colorScheme: signal(storedGlobalState.colorScheme ?? "dark"),
		language: signal(storedGlobalState.language ?? "en"),
		isConsoleDisplayed: signal(storedGlobalState.isConsoleDisplayed ?? false),
		consoleHeight: signal(storedGlobalState.consoleHeight ?? 300),
		logList: signal([]),
		logToSeeCount: signal(0),
		tr: signal({} as Tr), // temporary value
		trDynDict: signal({ mission_type: {} }),
		isWakeLock: signal(false),
		isAboveMd: signal(false),
		isBelowXxs: signal(false),
		viewportSize: signal({ height: 0, width: 0 }),
	};
};

/** The global state of the application. */
export const globalState: GlobalState = loadGlobalState();

/** @ignore */
export const tr = {
	get v() {
		return globalState.tr.value;
	},
};

/**
 * Translate a word.
 * @param word The word to translate.
 * @returns The translated word or the original word if it is not found.
 */
export const trFn = (word: keyof Tr) => globalState.tr.value[word] ?? word;

// TODO: these dictionaries should be loaded from the server (here simulated by getDynDict)
const _enDynDict: DynDict = {};
const _frDynDict: DynDict = {};
const getDynDict = async (language: LanguageType): Promise<DynDict> => (language === "en" ? _enDynDict : _frDynDict);

/**
 * Get a function that translate a word from a dynamic dictionary.
 * @param category The category of the word.
 * @returns The translation function.
 */
export const trDynFn = (category: TranslationCategoryType) => (word: string) =>
	globalState.trDynDict.value[category][word] ?? word;

/** If the language is loading. */
export const _isLanguageLoading = signal(false);

/** Load the translation file based on the language. */
effect(
	() => (
		(_isLanguageLoading.value = true),
		void Promise.all([import(`../tr/${globalState.language.value}.js`), getDynDict(globalState.language.value)]).then(
			([{ default: tr }, dynDict]) => (
				(globalState.tr.value = tr), (globalState.trDynDict.value = dynDict), (_isLanguageLoading.value = false)
			)
		)
	)
);

const localStorageState = computed(
	(): LocalStorageState => ({
		colorScheme: globalState.colorScheme.value,
		language: globalState.language.value,
		isConsoleDisplayed: globalState.isConsoleDisplayed.value,
		consoleHeight: globalState.consoleHeight.value,
	})
);

/** "md" if the screen is above md, "sm" otherwise. */
export const smMd = computed(() => (globalState.isAboveMd.value ? "md" : "sm"));
/** "sm" if the screen is above md, "xs" otherwise. */
export const xsSm = computed(() => (globalState.isAboveMd.value ? "sm" : "xs"));
/** "compact-md" if the screen is above md, "compact-sm" otherwise. */
export const compactXsSm = computed(() => `compact-${xsSm.value}`);

effect(() => localStorage.setItem("globalState", JSON.stringify(localStorageState.value)));

effect(() => void document.body.classList.toggle("dark", globalState.colorScheme.value === "dark"));
