import type { DynDict, GetDynDict } from "@/Shared/SharedModel";
import type { Context } from "elysia";

const dynDict: DynDict<string> = {
	en: { test: { dynamic_english: "dynamic_english" } },
	fr: { test: { dynamic_english: "francais_dynamique" } },
} satisfies DynDict<"dynamic_english">;

export class DynDictImpl {
	public get(_: Context, getDynDictParams: GetDynDict) {
		return dynDict[getDynDictParams.language] ?? {};
	}
}
