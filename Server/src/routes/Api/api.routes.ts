import { impl } from "@/impl";
import { v1App } from "@/routes/api/v-1/v-1.routes";
import { buildUnauthorizedSchema, ExecuteSchema } from "@/Shared/SharedModel";
import { TsToJsSchema } from "@/utils/ts-to-js";
import { Elysia, t } from "elysia";

export const apiApp = new Elysia({ prefix: "/api", tags: ["api"] })
	// health check
	.get("", () => "api is running", { detail: { summary: "API Health check", response: { 200: t.Literal("api is running") } } })
	// compile typescript code and execute it
	.post("/compile", (req) => impl.api.compile(req, req.body as string), {
		detail: {
			summary: "Compile typescript code and execute it",
			requestBody: { content: { "text/plain": {} } },
		},
		response: {
			200: TsToJsSchema,
			401: buildUnauthorizedSchema(["Token expired", "Invalid token", "superAdmin role required"] as const),
		},
	})
	// call for a dynamic route
	.post("/execute", (req) => impl.api.execute(req, req.body), {
		body: ExecuteSchema,
		detail: { summary: "Call for a dynamic route" },
	})
	.use(v1App);
