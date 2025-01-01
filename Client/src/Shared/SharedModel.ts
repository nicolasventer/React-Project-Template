import { t, type TSchema } from "elysia";
import { checkEnumObj } from "./SharedUtils";

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

/** Dynamic translation dictionary schema */
export const GetDynDictSchema = t.Object({
	/** Translation category */
	language: t.Union(LANGUAGES.map((l) => t.Literal(l))),
});

/** Get dynamic dictionary type */
export type GetDynDict = typeof GetDynDictSchema.static;

/** Translation categories */
export const TRANSLATION_CATEGORIES = ["test"] as const;
/**
 * Translation category object
 * @enum
 */
export const TRANSLATION_CATEGORIES_OBJ = {
	/** Test translation category */
	test: "test",
} as const;
/** Translation category type */
export type TranslationCategoryType = (typeof TRANSLATION_CATEGORIES)[number];
checkEnumObj<TranslationCategoryType>(TRANSLATION_CATEGORIES_OBJ);

/** Dynamic translation dictionary */
export type DynDict<T extends string> = Record<LanguageType, Record<TranslationCategoryType, Record<T, string>>>;

/** Permission values */
export const PERMISSIONS = ["create", "update", "delete", "read", "admin"] as const;
/**
 * Permission object
 * @enum
 */
export const PERMISSIONS_OBJ = {
	/** Create permission */
	create: "create",
	/** Update permission */
	update: "update",
	/** Delete permission */
	delete: "delete",
	/** Read permission */
	read: "read",
	/** Admin permission */
	admin: "admin",
} as const;
/** Permission type */
export type PermissionType = (typeof PERMISSIONS)[number];
checkEnumObj<PermissionType>(PERMISSIONS_OBJ);

/** User schema */
export const ExampleUserSchema = t.Object({
	/** User name */
	name: t.String({ minLength: 1, maxLength: 100 }),
	/** User email */
	email: t.String({ format: "email" }),
	/** User permissions */
	permissions: t.Array(t.Union(PERMISSIONS.map((permission) => t.Literal(permission)))),
});

/** User type */
export type ExampleUser = typeof ExampleUserSchema.static;

/** Find user schema */
export const FindUserSchema = t.Optional(
	t.Object({
		/** User name */
		name: t.Optional(t.String({ minLength: 1, maxLength: 100 })),
		/** User email */
		email: t.Optional(t.String({ format: "email" })),
		/** User permissions */
		permissions: t.Optional(t.Array(t.Union(PERMISSIONS.map((permission) => t.Literal(permission))))),
	})
);

/** Find user type */
export type FindUser = typeof FindUserSchema.static;
