import { impl } from "@/impl";
import type { Execute, GetDynDict } from "@/Shared/SharedModel";
import type { Context } from "elysia";
import { Elysia } from "elysia";

impl.dynDict.get = (_: Context, getDynDictParams: GetDynDict) => ({ test: { aze: getDynDictParams.language } });

impl.api.execute = (_: Context, body: Execute) =>
	new Elysia()
		.get("/", () => "Hello World")
		.get("/api", () => "Hello API")
		.get("/user/:id", (ctx: Context) => `Hello ${ctx.params.id}`)
		.fetch(new Request(`http://a.com${body.url}`));

// eslint-disable-next-line @typescript-eslint/no-explicit-any
impl.user.get = (_, getUserParams) => `Hello ${getUserParams.email}` as any;
