import { authApp } from "@/routes/api/v-1/auth/auth.routes";
import { passwordApp } from "@/routes/api/v-1/password/password.routes";
import { userApp } from "@/routes/api/v-1/user/user.routes";
import Elysia from "elysia";

export const v1App = new Elysia({ prefix: "/v1" })
	// health check
	.get("", () => "v1 is running")
	.use(userApp)
	.use(authApp)
	.use(passwordApp);
