import { impl } from "@/impl";
import { RequestResetPasswordSchema, UpdatePasswordSchema } from "@/Shared/SharedModel";
import Elysia from "elysia";

export const passwordApp = new Elysia({ prefix: "/password" })
	// request reset password
	.post("/request-reset", (req) => impl.password.requestReset(req, req.body), { body: RequestResetPasswordSchema })
	// reset password
	.put("/reset", (req) => impl.password.resetPassword(req, req.body), { body: UpdatePasswordSchema });
