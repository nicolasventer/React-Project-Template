import { impl } from "@/impl";
import type { Execute } from "@/Shared/SharedModel";
import type { Context } from "elysia";
import { Elysia } from "elysia";

impl.api.execute = (_: Context, body: Execute) =>
	new Elysia()
		.get("/", () => "Hello World")
		.get("/api", () => "Hello API")
		.get("/user/:id", (ctx: Context) => `Hello ${ctx.params.id}`)
		.fetch(new Request(`http://a.com${body.url}`));
