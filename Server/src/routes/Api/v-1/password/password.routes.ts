import { impl } from "@/impl";
import {
	buildUnauthorizedSchema,
	RequestResetPasswordOutputSchema,
	RequestResetPasswordSchema,
	UpdatePasswordSchema,
} from "@/Shared/SharedModel";
import { Elysia, t } from "elysia";

export const passwordApp = new Elysia({ prefix: "/password", tags: ["password"] })
	// request reset password
	.post("/request-reset", (req) => impl.password.requestReset(req, req.body), {
		body: RequestResetPasswordSchema,
		detail: { summary: "Request reset password" },
		response: {
			200: RequestResetPasswordOutputSchema,
			404: t.Literal("User not found"),
			500: t.Literal("Failed to send reset password link"),
		},
	})
	// reset password
	.put("/reset", (req) => impl.password.resetPassword(req, req.body), {
		body: UpdatePasswordSchema,
		detail: { summary: "Reset password" },
		response: {
			200: t.Literal("Password updated"),
			401: buildUnauthorizedSchema(["Token expired", "Invalid token"] as const),
			404: t.Literal("User not found or token already used"),
		},
	});
