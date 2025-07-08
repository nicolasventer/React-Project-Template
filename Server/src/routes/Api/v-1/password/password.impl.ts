import { dao } from "@/dao";
import { JwtService } from "@/jwt";
import { mailService } from "@/mail";
import type { RequestResetPassword, UpdatePassword } from "@/Shared/SharedModel";
import { B_ENABLE_MAIL_SERVICE, RESET_PASSWORD_URL } from "@/srv_config";
import type { Context } from "elysia";

export class PasswordImpl {
	requestReset = async (req: Context, { email }: RequestResetPassword) => {
		const user = await dao.password.getUserByEmail(email);
		if (!user) return req.status(404, "User not found");
		const token = JwtService.generateResetPasswordToken(user);

		// send the token in the response if mail service is disabled
		if (!B_ENABLE_MAIL_SERVICE) return req.status("OK", `${RESET_PASSWORD_URL}/${token}`);

		const res = await mailService.sendEmail(email, "Reset Password link", `Reset Password link: ${RESET_PASSWORD_URL}/${token}`);
		if (res) return req.status("OK", "Reset password link sent");
		return req.status("Internal Server Error", "Failed to send reset password link");
	};

	resetPassword = async (req: Context, updatePassword: UpdatePassword) => {
		const payload = JwtService.getVerifiedResetPasswordToken(req);
		if (payload === true) return req.status("Unauthorized", "Token expired");
		if (payload === false) return req.status("Unauthorized", "Invalid token");
		const user = await dao.password.updatePassword(payload, updatePassword);
		if (!user) return req.status("Not Found", "User not found or token already used");
		return req.status("OK", "Password updated");
	};
}
