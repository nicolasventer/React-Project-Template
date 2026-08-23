import "dotenv/config";

import { rateLimiter } from "@/elysiaPlugins";
import { apiApp } from "@/routes/api/api.routes";
import { PORT, SRV_URL } from "@/Shared/SharedConfig";
import { initWinston } from "@/winston";
import cors from "@elysiajs/cors";
import type { treaty } from "@elysiajs/eden";
import swagger from "@elysiajs/swagger";
import { SQLiteError } from "bun:sqlite";
import { Elysia, t } from "elysia";

initWinston();

export const app = new Elysia({ tags: ["root"] })
	.use(cors())
	.use(swagger({ documentation: { servers: [{ url: SRV_URL, description: "Server" }] } }))
	.use(rateLimiter)
	.onRequest(({ request }) => void console.log(`${request.method} ${new URL(request.url).pathname}`))
	.onError(({ error, code, path, status }) => {
		void console.error(`${code} ${path} ${error}`);
		if (error instanceof SQLiteError) return status(500, "Internal Server Error");
	})
	// health check
	.get("/", () => "Server is running" as const, {
		detail: { summary: "Server Health check" },
		response: { 200: t.Literal("Server is running") },
	})
	.all("/swagger/json/*", ({ path, redirect }) => redirect(path.replace("/swagger/json", "")))
	.use(apiApp)
	.listen(PORT);

export type App = typeof app;

export type Api = ReturnType<typeof treaty<App>>["api"];

console.log(`Server started on ${SRV_URL}`);
console.log(`Swagger available on ${SRV_URL}/swagger`);
