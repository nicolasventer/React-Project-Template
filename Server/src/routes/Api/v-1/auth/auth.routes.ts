import { impl } from "@/impl";
import { LoginSchema } from "@/Shared/SharedModel";
import Elysia from "elysia";

export const authApp = new Elysia({ prefix: "/auth", tags: ["auth"] })
	// login
	.post("/login", (req) => impl.auth.login(req, req.body), { body: LoginSchema, detail: { summary: "Login" } });
