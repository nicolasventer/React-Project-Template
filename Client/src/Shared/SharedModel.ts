import type { TSchema } from "elysia";
import { t } from "elysia";

export const Nullable = <T extends TSchema>(type: T) => t.Union([type, t.Null()]);

export const COLOR_SCHEMES = ["light", "dark"] as const;
export type ColorSchemeType = (typeof COLOR_SCHEMES)[number];

export const LANGUAGES = ["en", "fr"] as const;
export type LanguageType = (typeof LANGUAGES)[number];

export const ROLES = ["superAdmin", "admin", "user"] as const;
export type RoleType = (typeof ROLES)[number];
export const RoleSchema = t.Union(ROLES.map((role) => t.Literal(role)));

// generic

export const IdNumSchema = t.Object({
	id: t.Number(),
});
export type IdNum = typeof IdNumSchema.static;

export const HeadersSchema = t.Object({
	xToken: t.String(),
});
export type Headers = typeof HeadersSchema.static;

// auth

export const LoginSchema = t.Object({
	email: t.String(),
	password: t.String(),
});
export type Login = typeof LoginSchema.static;

export const LogoutSchema = t.Object({
	token: t.String(),
});
export type Logout = typeof LogoutSchema.static;

// user

export type UserOutput = {
	id: number;
	email: string;
	role: RoleType;
	lastLoginTime: number;
};

export const CreateUserSchema = t.Object({
	email: t.String({ format: "email" }),
	role: RoleSchema,
});
export type CreateUser = typeof CreateUserSchema.static;

export const UpdateUserSchema = t.Object({
	email: t.Optional(t.String({ format: "email" })),
	role: t.Optional(RoleSchema),
	password: t.Optional(t.String()),
});
export type UpdateUser = typeof UpdateUserSchema.static;

// execute

export const ExecuteSchema = t.Object({
	url: t.String({ description: "The URL to execute, should start with /", examples: ["/hello", "/user/123"] }),
	body: t.Any({ description: "The body to send to the URL" }),
});
export type Execute = typeof ExecuteSchema.static;
