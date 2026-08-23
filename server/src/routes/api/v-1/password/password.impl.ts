import { dao } from "@/dao";
import { JwtService, type AppContext, type TokenRequest } from "@/jwt";
import { mailService } from "@/mail";
import type { RequestResetPassword, UpdatePassword } from "@/Shared/SharedModel";
import { B_ENABLE_MAIL_SERVICE, RESET_PASSWORD_URL } from "@/srv_config";
import { status } from "elysia";

export class PasswordImpl {
	requestReset = async (_: AppContext, { email }: RequestResetPassword) => {
		const user = await dao.password.getUserByEmail(email);
		if (!user) return status("Not Found", "User not found");
		const token = JwtService.generateResetPasswordToken(user);

		// send the token in the response if mail service is disabled
		if (!B_ENABLE_MAIL_SERVICE) return { link: `${RESET_PASSWORD_URL}/${token}` };

		const res = await mailService.sendEmail(email, "Reset Password link", `Reset Password link: ${RESET_PASSWORD_URL}/${token}`);
		if (res) return "Reset password link sent";
		return status("Internal Server Error", "Failed to send reset password link");
	};

	resetPassword = async (req: TokenRequest, updatePassword: UpdatePassword) => {
		const payload = JwtService.getVerifiedResetPasswordToken(req);
		if (payload === true) return status("Unauthorized", "Token expired");
		if (payload === false) return status("Unauthorized", "Invalid token");
		const user = await dao.password.updatePassword(payload, updatePassword);
		if (!user) return status("Not Found", "User not found or token already used");
		return "Password updated";
	};
}
