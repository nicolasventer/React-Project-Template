import { impl } from "@/impl";
import { buildUnauthorizedSchema, HeadersSchema, LoginOutputSchema, LoginSchema } from "@/Shared/SharedModel";
import { Elysia } from "elysia";

export const authApp = new Elysia({ prefix: "/auth", tags: ["auth"] })
	// login
	.post("/login", (req) => impl.auth.login(req, req.body), {
		body: LoginSchema,
		detail: { summary: "Login" },
		response: { 200: LoginOutputSchema, 401: buildUnauthorizedSchema(["Invalid email or password"] as const) },
	})
	// refresh token
	.get("/token/refresh", (req) => impl.auth.refreshToken(req), {
		headers: HeadersSchema,
		detail: { summary: "Refresh token" },
		response: { 200: LoginOutputSchema, 401: buildUnauthorizedSchema(["Invalid token"] as const) },
	});
