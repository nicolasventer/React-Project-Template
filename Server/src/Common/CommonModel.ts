import { t, type TSchema } from "elysia";
import { checkEnumObj } from "./CommonUtils";

/**
 * Nullable type
 * @param type Type to make nullable
 * @returns Union of type and null
 */
export const Nullable = <T extends TSchema>(type: T) => t.Union([type, t.Null()]);

/** Color scheme values */
export const COLOR_SCHEMES = ["light", "dark"] as const;
/**
 * Color scheme object
 * @enum
 */
export const COLOR_SCHEMES_OBJ = {
	/** Light color scheme */
	light: "light",
	/** Dark color scheme */
	dark: "dark",
} as const;
/** Color scheme type */
export type ColorSchemeType = (typeof COLOR_SCHEMES)[number];
checkEnumObj<ColorSchemeType>(COLOR_SCHEMES_OBJ);

/** Log types */
export const LOG_TYPES = ["log", "info", "warn", "error"] as const;
/**
 * Log type object
 * @enum
 */
export const LOG_TYPES_OBJ = {
	/** Log log type */
	log: "log",
	/** Info log type */
	info: "info",
	/** Warn log type */
	warn: "warn",
	/** Error log type */
	error: "error",
} as const;
/** Log type */
export type LogType = (typeof LOG_TYPES)[number];
checkEnumObj<LogType>(LOG_TYPES_OBJ);

/** Log type */
export type Log = {
	/** The type of the message */
	type: LogType;
	/** The time of the message (format: HH:mm:ss.SSS) */
	time: string;
	/** The message */
	message: string;
};

/** Language values */
export const LANGUAGES = ["en", "fr"] as const;
/**
 * Language object
 * @enum
 */
export const LANGUAGES_OBJ = {
	/** English language */
	en: "en",
	/** French language */
	fr: "fr",
} as const;
/** Language type */
export type LanguageType = (typeof LANGUAGES)[number];
checkEnumObj<LanguageType>(LANGUAGES_OBJ);

/** Translation categories */
export const TRANSLATION_CATEGORIES = [] as const;
/**
 * Translation category object
 * @enum
 */
export const TRANSLATION_CATEGORIES_OBJ = {} as const;
/** Translation category type */
export type TranslationCategoryType = (typeof TRANSLATION_CATEGORIES)[number];
checkEnumObj<TranslationCategoryType>(TRANSLATION_CATEGORIES_OBJ);

/** Dynamic translation dictionary */
export type DynDict = Record<TranslationCategoryType, Record<string, string>>;
