import { impl } from "@/impl";
import { v1App } from "@/routes/api/v-1/v-1.routes";
import { ExecuteSchema } from "@/Shared/SharedModel";
import Elysia from "elysia";

export const apiApp = new Elysia({ prefix: "/api" })
	// health check
	.get("", () => "api is running")
	// compile typescript code and execute it
	.post("/compile", (req) => impl.api.compile(req, req.body as string), {
		detail: { requestBody: { content: { "text/plain": {} } } },
	})
	// call for a dynamic route
	.post("/execute", (req) => impl.api.execute(req, req.body), { body: ExecuteSchema })
	.use(v1App);
