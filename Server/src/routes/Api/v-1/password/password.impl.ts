import { dao } from "@/dao";
import { JwtService } from "@/jwt";
import type { RequestResetPassword, UpdatePassword } from "@/Shared/SharedModel";
import type { Context } from "elysia";

const RESET_PASSWORD_URL = `http://localhost:2000/reset-password`;

class MailService {
	sendEmail = async (email: string, subject: string, text: string) => {
		return true;
	};
}
const mailService = new MailService();

export class PasswordImpl {
	requestReset = async (req: Context, { email }: RequestResetPassword) => {
		const user = await dao.password.getUserByEmail(email);
		if (!user) return req.status(404, "User not found");
		const token = JwtService.generateResetPasswordToken(user);
		return mailService.sendEmail(email, "Reset Password link", `Reset Password link: ${RESET_PASSWORD_URL}/${token}`);
	};

	resetPassword = async (req: Context, updatePassword: UpdatePassword) => {
		const payload = JwtService.getVerifiedResetPasswordToken(req);
		if (payload === true) return req.status("Unauthorized", "Token expired");
		if (payload === false) return req.status("Unauthorized", "Invalid token");
		const user = await dao.password.updatePassword(payload, updatePassword);
		if (!user) return req.status(404, "User not found or token already used");
		return req.status(200, "Password updated");
	};
}
