import type { Context } from "elysia";
import type { DynDict, GetDynDict } from "./Shared/SharedModel";

const dynDict: DynDict<string> = {
	en: { test: { dynamic_english: "dynamic_english" } },
	fr: { test: { dynamic_english: "francais_dynamique" } },
} satisfies DynDict<"dynamic_english">;

export const getDynDict = (_: Context, getDynDictParams: GetDynDict) => dynDict[getDynDictParams.language] ?? {};
