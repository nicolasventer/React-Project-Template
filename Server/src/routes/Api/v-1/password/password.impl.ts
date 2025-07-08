import { dao } from "@/dao";
import { JwtService } from "@/jwt";
import type { RequestResetPassword, UpdatePassword } from "@/Shared/SharedModel";
import { B_ENABLE_MAIL_SERVICE, RESET_PASSWORD_URL } from "@/srv_config";
import type { Context } from "elysia";
import nodemailer from "nodemailer";

/*
 * GMAIL OAUTH2 SETUP GUIDE
 *
 * Step 1: Create OAuth 2.0 Credentials
 * - Go to https://console.cloud.google.com/
 * - Go to "APIs & Services" > "Credentials"
 * - Click "Create Credentials" > "OAuth client ID"
 * - Choose "Web application" as application type
 * - Add authorized redirect URIs:
 *   * https://developers.google.com/oauthplayground
 * - Save and note your Client ID and Client Secret
 *
 * Step 2: Get Refresh Token
 * - Go to https://developers.google.com/oauthplayground/
 * - Click the settings icon (⚙️) in the top right
 * - Check "Use your own OAuth credentials"
 * - Enter your Client ID and Client Secret from Step 2
 * - Close settings
 * - In the left panel, find "Gmail API v1" and select:
 *   * https://mail.google.com/
 * - Click "Authorize APIs"
 * - Sign in with your Gmail account and grant permissions
 * - Click "Exchange authorization code for tokens"
 * - Copy the "Refresh token" value
 *
 * Step 3: Set Environment Variables
 * Add these to your .env file:
 * USER_EMAIL=your-email@gmail.com
 * USER_NAME=Your Name
 * GOOGLE_CLIENT_ID=your-client-id-from-step-2
 * GOOGLE_CLIENT_SECRET=your-client-secret-from-step-2
 * GOOGLE_REFRESH_TOKEN=your-refresh-token-from-step-3
 */

const transporter = nodemailer.createTransport({
	service: "gmail",
	auth: {
		type: "OAuth2",
		user: process.env.USER_EMAIL,
		clientId: process.env.GOOGLE_CLIENT_ID,
		clientSecret: process.env.GOOGLE_CLIENT_SECRET,
		refreshToken: process.env.GOOGLE_REFRESH_TOKEN,
	},
});

class MailService {
	sendEmail = async (email: string, subject: string, text: string) => {
		try {
			await transporter.sendMail({
				from: `"${process.env.USER_NAME}" <${process.env.USER_EMAIL}>`, // sender address
				to: email, // list of receivers
				subject, // Subject line
				text, // plain text body
			});
			console.log(`Mail sent to: ${email}`);
			return true;
		} catch (err) {
			console.error(`Error while sending mail ${err}`);
			return false;
		}
	};
}
const mailService = new MailService();

let isMailServiceReady = false;
transporter
	.verify()
	.then(() => {
		isMailServiceReady = true;
		console.log("Server is ready to take our messages");
		// mailService.sendEmail(process.env.USER_EMAIL, "Test", "This is the test email");
	})
	.catch((err) => {
		console.error(`Error while verifying transporter ${err}`);
		process.exit(1);
	});

export class PasswordImpl {
	requestReset = async (req: Context, { email }: RequestResetPassword) => {
		const user = await dao.password.getUserByEmail(email);
		if (!user) return req.status(404, "User not found");
		const token = JwtService.generateResetPasswordToken(user);

		// send the token in the response if mail service is disabled
		if (!B_ENABLE_MAIL_SERVICE) return req.status("OK", `${RESET_PASSWORD_URL}/${token}`);

		const res = await mailService.sendEmail(email, "Reset Password link", `Reset Password link: ${RESET_PASSWORD_URL}/${token}`);
		if (res) return req.status("OK", "Reset password link sent");
		if (!isMailServiceReady) return req.status("Internal Server Error", "Mail service is not ready");
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
