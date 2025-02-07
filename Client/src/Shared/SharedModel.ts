import { t, type TSchema } from "elysia";
import { checkEnumObj } from "./SharedUtils";

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

export const GetDynDictSchema = t.Object({
	language: t.Union(LANGUAGES.map((l) => t.Literal(l))),
});

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

export const ExampleUserSchema = t.Object({
	name: t.String({ minLength: 1, maxLength: 100 }),
	email: t.String({ format: "email" }),
	permissions: t.Array(t.Union(PERMISSIONS.map((permission) => t.Literal(permission)))),
});

export type ExampleUser = typeof ExampleUserSchema.static;

export const FindUserSchema = t.Optional(
	t.Object({
		name: t.Optional(t.String({ minLength: 1, maxLength: 100 })),
		email: t.Optional(t.String({ format: "email" })),
		permissions: t.Optional(t.Array(t.Union(PERMISSIONS.map((permission) => t.Literal(permission))))),
	})
);

export type FindUser = typeof FindUserSchema.static;
