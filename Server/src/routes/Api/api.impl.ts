/* eslint-disable @typescript-eslint/no-unused-expressions */
import { db, json_group_array, relations, schema } from "@/drizzle";
import { impl } from "@/impl";
import type { Execute } from "@/Shared/SharedModel";
import { tsToJs } from "@/utils/ts-to-js";
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

	compile(_: Context, code: string) {
		const jsCode = tsToJs(code);
		if (jsCode) eval(jsCode);
		return jsCode;
	}

	execute(_: Context, __: Execute): MaybePromise<Response> {
		return new Response("nothing");
	}
}
