import { dao } from "@/dao";
import { JwtService } from "@/jwt";
import { mailService } from "@/mail";
import type {
	RequestResetPassword,
	RequestResetPasswordOutput,
	UnauthorizedValueType,
	UpdatePassword,
} from "@/Shared/SharedModel";
import { B_ENABLE_MAIL_SERVICE, RESET_PASSWORD_URL } from "@/srv_config";
import type { Context } from "elysia";

export class PasswordImpl {
	requestReset = async (
		req: Context<{
			response: {
				200: RequestResetPasswordOutput;
				404: "User not found";
				500: "Failed to send reset password link";
			};
		}>,
		{ email }: RequestResetPassword
	) => {
		const user = await dao.password.getUserByEmail(email);
		if (!user) return req.status("Not Found", "User not found");
		const token = JwtService.generateResetPasswordToken(user);

		// send the token in the response if mail service is disabled
		if (!B_ENABLE_MAIL_SERVICE) return { link: `${RESET_PASSWORD_URL}/${token}` };

		const res = await mailService.sendEmail(email, "Reset Password link", `Reset Password link: ${RESET_PASSWORD_URL}/${token}`);
		if (res) return "Reset password link sent";
		return req.status("Internal Server Error", "Failed to send reset password link");
	};

	resetPassword = async (
		req: Context<{
			response: { 200: "Password updated"; 401: UnauthorizedValueType; 404: "User not found or token already used" };
		}>,
		updatePassword: UpdatePassword
	) => {
		const payload = JwtService.getVerifiedResetPasswordToken(req);
		if (payload === true) return req.status("Unauthorized", "Token expired");
		if (payload === false) return req.status("Unauthorized", "Invalid token");
		const user = await dao.password.updatePassword(payload, updatePassword);
		if (!user) return req.status("Not Found", "User not found or token already used");
		return "Password updated";
	};
}
