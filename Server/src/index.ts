import { apiApp } from "@/routes/api/api.routes";
import { PORT, SRV_URL } from "@/Shared/SharedConfig";
import { initWinston } from "@/winston";
import cors from "@elysiajs/cors";
import type { treaty } from "@elysiajs/eden";
import swagger from "@elysiajs/swagger";
import Elysia from "elysia";

initWinston();

export const app = new Elysia()
	.use(cors())
	.use(swagger())
	.onRequest(({ request }) => void console.log(`${request.method} ${new URL(request.url).pathname}`))
	.onError(({ error, code, path }) => void console.error(`${code} ${path} ${error}`))
	// health check
	.get("/", () => "Server is running")
	.use(apiApp)
	.listen(PORT);

export type App = typeof app;

export type Api = ReturnType<typeof treaty<App>>["api"];

console.log(`Server started on ${SRV_URL}`);
console.log(`Swagger available on ${SRV_URL}/swagger`);
