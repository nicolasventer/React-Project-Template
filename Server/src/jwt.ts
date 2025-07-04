import type { User } from "@/drizzle";
import { JWT_SECRET } from "@/env";
import type { IdNum, UnauthorizedValueType } from "@/Shared/SharedModel";
import { SimpleMapCache } from "@/utils/SimpleMapCache";
import type { Context } from "elysia";
import jwt from "jsonwebtoken";

export type LoginPayload = Pick<User, "userId" | "email" | "role">;

const revokedLoginIdCache = new SimpleMapCache(1000 * 60 * 60); // 1h

// object built with only the properties we want to include in the token
const generateLoginToken = ({ userId, email, role }: LoginPayload): string =>
	jwt.sign({ userId, email, role }, JWT_SECRET, { expiresIn: "1h" });

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

const cancelRevokedLoginId = (id: number) => revokedLoginIdCache.delete(id.toString());

// returns LoginPayload if token is valid
// returns true if token is expired
// returns false if token is invalid
const getVerifiedLoginToken = (
	req:
		| Context<{ response: { 401: UnauthorizedValueType } }>
		| Context<{ params: IdNum; response: { 401: UnauthorizedValueType } }>
) => {
	const loginPayload = !!req.headers?.["x-token"] && verifyLoginToken(req.headers?.["x-token"]);
	if (typeof loginPayload === "boolean") return loginPayload;
	return revokedLoginIdCache.get<boolean>(loginPayload.userId.toString()) ? true : loginPayload;
};

const decodeLoginToken = (token: string) => jwt.decode(token) as LoginPayload;

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
) => !!req.headers?.["x-token"] && verifyResetPasswordToken(req.headers?.["x-token"]);

export const JwtService = {
	generateLoginToken,
	getVerifiedLoginToken,
	decodeLoginToken,
	revokeLoginId,
	cancelRevokedLoginId,
	generateResetPasswordToken,
	getVerifiedResetPasswordToken,
};
