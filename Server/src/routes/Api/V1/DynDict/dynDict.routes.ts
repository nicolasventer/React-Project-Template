import { DynDictImpl } from "@/routes/Api/V1/DynDict/dynDict.impl";
import { GetDynDictSchema } from "@/Shared/SharedModel";
import { Elysia } from "elysia";

const dynDictImpl = new DynDictImpl();

export const dynDictApp = new Elysia({ prefix: "/dyn-dict" })
	// get dynamic dictionary
	.get("/:language", (req) => dynDictImpl.get(req, req.params), {
		params: GetDynDictSchema,
	});
