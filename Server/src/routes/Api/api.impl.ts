/* eslint-disable @typescript-eslint/no-unused-expressions */
import { db, json_group_array, relations, schema } from "@/drizzle";
import { impl } from "@/impl";
import { JwtService } from "@/jwt";
import type { Execute } from "@/Shared/SharedModel";
import { tsToJs, type TsToJsType } from "@/utils/ts-to-js";
import type { Context, MaybePromise } from "elysia";
import { Elysia } from "elysia";

export class ApiImpl {
	// eslint-disable-next-line no-unused-private-class-members
	#_() {
		impl;
		Elysia;
		db;
		schema;
		relations;
		json_group_array;
	}

	compile = (req: Context<{ response: { 200: TsToJsType } }>, code: string) => {
		const res = JwtService.checkRole(req, "superAdmin");
		if (res) return res;
		const jsCode = tsToJs(code);
		if (typeof jsCode === "string" && jsCode) eval(jsCode);
		return jsCode;
	};

	execute = (_: Context, __: Execute): MaybePromise<Response> => new Response("nothing");
}
