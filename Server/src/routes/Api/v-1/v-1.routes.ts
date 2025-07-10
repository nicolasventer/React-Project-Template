import { authApp } from "@/routes/api/v-1/auth/auth.routes";
import { imageApp } from "@/routes/api/v-1/image/image.routes";
import { passwordApp } from "@/routes/api/v-1/password/password.routes";
import { userApp } from "@/routes/api/v-1/user/user.routes";
import { voteApp } from "@/routes/api/v-1/vote/vote.routes";
import { Elysia, t } from "elysia";

export const v1App = new Elysia({ prefix: "/v1" })
	// health check
	.get("", () => "v1 is running" as const, {
		detail: { summary: "V1 Health check" },
		response: { 200: t.Literal("v1 is running") },
	})
	.use(userApp)
	.use(authApp)
	.use(passwordApp)
	.use(voteApp)
	.use(imageApp);
