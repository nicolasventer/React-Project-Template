import { dao } from "@/dao";
import { JwtService } from "@/jwt";
import type { Login } from "@/Shared/SharedModel";
import { hashPassword } from "@/utils/hash";
import type { Context } from "elysia";

export class AuthImpl {
	login = async (req: Context, { email, password }: Login) => {
		const hashedPassword = await hashPassword(password);
		const user = await dao.auth.login(email, hashedPassword);
		if (!user) return req.status("Unauthorized", "Invalid email or password");
		const token = JwtService.generateLoginToken(user);
		return { token };
	};
}
