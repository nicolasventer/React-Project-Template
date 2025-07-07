import type { User } from "@/drizzle";
import { JWT_SECRET } from "@/env";
import type { IdNum, RoleType } from "@/Shared/SharedModel";
import type { Context } from "elysia";
import jwt from "jsonwebtoken";

export type LoginPayload = Pick<User, "id" | "email" | "role">;

// object built with only the properties we want to include in the token
const generateLoginToken = ({ id, email, role }: LoginPayload): string =>
	jwt.sign({ id, email, role }, JWT_SECRET, { expiresIn: "3h" });

// returns LoginPayload if token is valid,
// returns true if token is expired
// returns false if token is invalid
const verifyLoginToken = (token: string): LoginPayload | boolean => {
	try {
		return jwt.verify(token, JWT_SECRET) as LoginPayload;
	} catch (error) {
		return error instanceof jwt.TokenExpiredError;
	}
};

const getVerifiedToken = (req: Context | Context<{ params: IdNum }>) =>
	!!req.headers.xToken && verifyLoginToken(req.headers.xToken);

// returns undefined if token is valid
// usage: checkRole(req, "admin") || dao.user.create(createUser);
const checkRole = (req: Context | Context<{ params: IdNum }>, role: RoleType) => {
	const verified = getVerifiedToken(req);
	if (verified === true) return req.status("Unauthorized", "Token expired");
	if (verified === false) return req.status("Unauthorized", "Invalid token");
	if (verified.role !== role) return req.status("Unauthorized", `${role} role required`);
};

export const JwtService = {
	generateLoginToken,
	getVerifiedToken,
	checkRole,
};
