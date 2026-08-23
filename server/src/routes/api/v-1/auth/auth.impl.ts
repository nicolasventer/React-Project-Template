import { dao } from "@/dao";
import { JwtService, type AppContext, type TokenRequest } from "@/jwt";
import type { Login } from "@/Shared/SharedModel";
import { hashPassword } from "@/utils/hash";
import { status } from "elysia";

export class AuthImpl {
	login = async (_: AppContext, { email, password }: Login) => {
		const hashedPassword = await hashPassword(password);
		const user = await dao.auth.login(email, hashedPassword);
		if (!user) return status("Unauthorized", "Invalid email or password");
		JwtService.cancelRevokedLoginId(user.userId);
		const token = JwtService.generateLoginToken(user);
		return { token, role: user.role };
	};

	refreshToken = (req: TokenRequest) => {
		const verified = JwtService.getVerifiedLoginToken(req);
		if (verified === false) return status("Unauthorized", "Invalid token");
		const payload = verified === true ? JwtService.decodeLoginToken(req.headers?.["x-token"] ?? "") : verified;
		const token = JwtService.generateLoginToken(payload);
		return { token, role: payload.role };
	};
}
