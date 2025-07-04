import type { TLiteral, TLiteralValue, TUnion } from "@sinclair/typebox";
import type { TSchema } from "elysia";
import { t } from "elysia";

export const Nullable = <T extends TSchema>(type: T) => t.Union([type, t.Null()]);

type TLiteralArray<T extends readonly TLiteralValue[]> = T extends readonly [infer A, ...infer B]
	? A extends TLiteralValue
		? B extends TLiteralValue[]
			? [TLiteral<A>, ...TLiteralArray<B>]
			: never
		: never
	: [];
const tUnionLiteralArray = <T extends readonly TLiteralValue[]>(array: T) =>
	t.Union(array.map((value) => t.Literal(value as T[number]))) as TUnion<TLiteralArray<T>>;

export const COLOR_SCHEMES = ["light", "dark"] as const;
export type ColorSchemeType = (typeof COLOR_SCHEMES)[number];

export const LANGUAGES = ["en", "fr"] as const;
export type LanguageType = (typeof LANGUAGES)[number];

export const ROLES = ["superAdmin", "admin", "user"] as const;
export type RoleType = (typeof ROLES)[number];
export const RoleSchema = tUnionLiteralArray(ROLES);

export const UNAUTHORIZED_VALUES = [
	"Token expired",
	"Invalid token",
	"user role required",
	"superAdmin role required",
	"admin role required",
	"Invalid email or password",
] as const;
export type UnauthorizedValueType = (typeof UNAUTHORIZED_VALUES)[number];
// should be used like this: buildUnauthorizedSchema(["Token expired", "Invalid token"] as const)
// DO NOT FORGET THE 'as const'
export const buildUnauthorizedSchema = <T extends readonly UnauthorizedValueType[]>(values: T) =>
	tUnionLiteralArray(values) as TUnion<TLiteralArray<T>>;

export const checkRoleSchema = <T extends RoleType | "*">(role: T) =>
	role === "*"
		? buildUnauthorizedSchema(["Token expired", "Invalid token"] as const)
		: buildUnauthorizedSchema(["Token expired", "Invalid token", `${role as Exclude<T, "*">} role required`] as const);

// generic

export const IdNumSchema = t.Object({
	id: t.Number(),
});
export type IdNum = typeof IdNumSchema.static;

export const HeadersSchema = t.Object({
	"x-token": t.String(),
});
export type Headers = typeof HeadersSchema.static;

// auth

export const LoginSchema = t.Object({
	email: t.String(),
	password: t.String(),
});
export type Login = typeof LoginSchema.static;

export const LoginOutputSchema = t.Object({
	token: t.String(),
	role: RoleSchema,
});
export type LoginOutput = typeof LoginOutputSchema.static;

// user

export const UserOutputSchema = t.Object({
	userId: t.Number(),
	email: t.String(),
	role: RoleSchema,
	lastLoginTime: t.Number(),
});
export type UserOutput = typeof UserOutputSchema.static;
export const MultiUserOutputSchema = t.Object({ users: t.Array(UserOutputSchema) });
export type MultiUserOutput = typeof MultiUserOutputSchema.static;

export const CreateUserSchema = t.Object({
	email: t.String(),
	password: t.String(),
});
export type CreateUser = typeof CreateUserSchema.static;

export const UpdateUserSchema = t.Object({
	role: RoleSchema,
});
export type UpdateUser = typeof UpdateUserSchema.static;

export const UpdateUserOutputSchema = t.Object({
	userId: t.Number(),
});
export type UpdateUserOutput = typeof UpdateUserOutputSchema.static;

export const UpdateSelfUserSchema = t.Object({
	password: t.String(),
});
export type UpdateSelfUser = typeof UpdateSelfUserSchema.static;

// password

export const RequestResetPasswordSchema = t.Object({
	email: t.String(),
});
export type RequestResetPassword = typeof RequestResetPasswordSchema.static;

export const UpdatePasswordSchema = t.Object({
	password: t.String(),
});
export type UpdatePassword = typeof UpdatePasswordSchema.static;

export const RequestResetPasswordOutputSchema = t.Union([t.Literal("Reset password link sent"), t.Object({ link: t.String() })]);
export type RequestResetPasswordOutput = typeof RequestResetPasswordOutputSchema.static;

// image

export const ImageOutputSchema = t.Object({
	imageId: t.Number(),
	url: t.String(),
	positiveVotes: t.Number(),
	negativeVotes: t.Number(),
	totalVotes: t.Number(),
	score: t.Number(),
	userVote: Nullable(t.Number()),
	userVoteId: Nullable(t.Number()),
});
export type ImageOutput = typeof ImageOutputSchema.static;
export const MultiImageOutputSchema = t.Object({
	images: t.Array(ImageOutputSchema),
});
export type MultiImageOutput = typeof MultiImageOutputSchema.static;

// vote

export const VoteOutputSchema = t.Object({
	voteId: t.Number(),
});
export type VoteOutput = typeof VoteOutputSchema.static;

export const CreateVoteSchema = t.Object({
	imageId: t.Number(),
	isPositive: t.Boolean(),
});
export type CreateVote = typeof CreateVoteSchema.static;

export const UpdateVoteSchema = t.Object({
	isPositive: t.Boolean(),
});
export type UpdateVote = typeof UpdateVoteSchema.static;

// execute

export const ExecuteSchema = t.Object({
	url: t.String({ description: "The URL to execute, should start with /", examples: ["/hello", "/user/123"] }),
	body: t.Any({ description: "The body to send to the URL" }),
});
export type Execute = typeof ExecuteSchema.static;
