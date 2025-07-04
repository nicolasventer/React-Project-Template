import { dao } from "@/dao";
import { JwtService } from "@/jwt";
import type { Headers, Login, LoginOutput, UnauthorizedValueType } from "@/Shared/SharedModel";
import { hashPassword } from "@/utils/hash";
import type { Context } from "elysia";

export class AuthImpl {
	login = async (req: Context<{ response: { 200: LoginOutput; 401: UnauthorizedValueType } }>, { email, password }: Login) => {
		const hashedPassword = await hashPassword(password);
		const user = await dao.auth.login(email, hashedPassword);
		if (!user) return req.status("Unauthorized", "Invalid email or password");
		JwtService.cancelRevokedLoginId(user.userId);
		const token = JwtService.generateLoginToken(user);
		return { token, role: user.role };
	};

	refreshToken = (req: Context<{ headers: Headers; response: { 200: LoginOutput; 401: UnauthorizedValueType } }>) => {
		const verified = JwtService.getVerifiedLoginToken(req);
		if (verified === false) return req.status("Unauthorized", "Invalid token");
		const payload = verified === true ? JwtService.decodeLoginToken(req.headers?.["x-token"]) : verified;
		const token = JwtService.generateLoginToken(payload);
		return { token, role: payload.role };
	};
}
