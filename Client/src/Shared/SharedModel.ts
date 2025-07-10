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
export type MultiUserOutput = {
	users: UserOutput[];
};

export const CreateUserSchema = t.Object({
	email: t.String({ format: "email" }),
	password: t.String(),
});
export type CreateUser = typeof CreateUserSchema.static;

export const UpdateUserSchema = t.Object({
	role: RoleSchema,
});
export type UpdateUser = typeof UpdateUserSchema.static;

export const UpdateSelfUserSchema = t.Object({
	password: t.String(),
});
export type UpdateSelfUser = typeof UpdateSelfUserSchema.static;

// password

export const RequestResetPasswordSchema = t.Object({
	email: t.String({ format: "email" }),
});
export type RequestResetPassword = typeof RequestResetPasswordSchema.static;

export const UpdatePasswordSchema = t.Object({
	password: t.String(),
});
export type UpdatePassword = typeof UpdatePasswordSchema.static;

// image

/*

export const ImageOutputSchema = t.Object({
	imageId: t.Number(),
	url: t.String(),
	positiveVotes: t.Number(),
	negativeVotes: t.Number(),
	totalVotes: t.Number(),
	score: t.Number(),
});
export type ImageOutput = typeof ImageOutputSchema.static;
export const MultiImageOutputSchema = t.Object({
	images: t.Array(ImageOutputSchema),
});
export type MultiImageOutput = typeof MultiImageOutputSchema.static;

export const ImageUserOutputSchema = t.Intersect([
	ImageOutputSchema,
	t.Object({ userVote: t.Union([t.Literal(1), t.Literal(0), t.Null()]) }),
]);
export type ImageUserOutput = typeof ImageUserOutputSchema.static;
export const MultiImageUserOutputSchema = t.Object({ images: t.Array(ImageUserOutputSchema) });
export type MultiImageUserOutput = typeof MultiImageUserOutputSchema.static;

*/

export type ImageOutput = {
	imageId: number;
	url: string;
	positiveVotes: number;
	negativeVotes: number;
	totalVotes: number;
	score: number;
};
export type MultiImageOutput = {
	images: ImageOutput[];
};

export type ImageUserOutput = ImageOutput & { userVote: number | null };
export type MultiImageUserOutput = {
	images: ImageUserOutput[];
};

// vote

export type VoteOutput = {
	voteId: number;
};

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
