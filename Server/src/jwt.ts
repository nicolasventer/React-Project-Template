import type { User } from "@/drizzle";
import { JWT_SECRET } from "@/env";
import type { IdNum, RoleType, UnauthorizedValueType } from "@/Shared/SharedModel";
import { SimpleMapCache } from "@/utils/SimpleMapCache";
import type { Context } from "elysia";
import jwt from "jsonwebtoken";

export type LoginPayload = Pick<User, "id" | "email" | "role">;

const revokedLoginIdCache = new SimpleMapCache(1000 * 60 * 60); // 1h

// object built with only the properties we want to include in the token
const generateLoginToken = ({ id, email, role }: LoginPayload): string =>
	jwt.sign({ id, email, role }, JWT_SECRET, { expiresIn: "1h" });

// returns LoginPayload if token is valid
// returns true if token is expired
// returns false if token is invalid
const verifyLoginToken = (token: string): LoginPayload | boolean => {
	try {
		return jwt.verify(token, JWT_SECRET) as LoginPayload;
	} catch (error) {
		return error instanceof jwt.TokenExpiredError;
	}
};

const revokeLoginId = (id: number) => revokedLoginIdCache.set(id.toString(), true);

// returns LoginPayload if token is valid
// returns true if token is expired
// returns false if token is invalid
const getVerifiedLoginToken = (
	req:
		| Context<{ response: { 401: UnauthorizedValueType } }>
		| Context<{ params: IdNum; response: { 401: UnauthorizedValueType } }>
) => {
	const loginPayload = !!req.headers.xToken && verifyLoginToken(req.headers.xToken);
	if (typeof loginPayload === "boolean") return loginPayload;
	return revokedLoginIdCache.get<boolean>(loginPayload.id.toString()) ? true : loginPayload;
};

// returns undefined if token is valid
// usage: checkRole(req, "admin") || dao.user.create(createUser);
const checkRole = <T extends RoleType>(
	req:
		| Context<{ response: { 401: UnauthorizedValueType } }>
		| Context<{ params: IdNum; response: { 401: UnauthorizedValueType } }>,
	role: T
) => {
	const verified = getVerifiedLoginToken(req);
	if (verified === true) return req.status("Unauthorized", "Token expired");
	if (verified === false) return req.status("Unauthorized", "Invalid token");
	if (verified.role !== role) return req.status("Unauthorized", `${role} role required`);
};

export type ResetPasswordPayload = Pick<User, "email" | "password">;

const generateResetPasswordToken = ({ email, password }: ResetPasswordPayload): string =>
	jwt.sign({ email, password }, JWT_SECRET, { expiresIn: "1h" });

const verifyResetPasswordToken = (token: string): ResetPasswordPayload | boolean => {
	try {
		return jwt.verify(token, JWT_SECRET) as ResetPasswordPayload;
	} catch (error) {
		return error instanceof jwt.TokenExpiredError;
	}
};

const getVerifiedResetPasswordToken = (
	req:
		| Context<{ response: { 401: UnauthorizedValueType } }>
		| Context<{ params: IdNum; response: { 401: UnauthorizedValueType } }>
) => !!req.headers.xToken && verifyResetPasswordToken(req.headers.xToken);

export const JwtService = {
	generateLoginToken,
	getVerifiedLoginToken,
	revokeLoginId,
	checkRole,
	generateResetPasswordToken,
	getVerifiedResetPasswordToken,
};
