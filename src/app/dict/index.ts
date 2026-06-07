import type { Tr } from "@/app/dict/lang/en";
import { en } from "@/app/dict/lang/en";

export const dict = {
	en: () => Promise.resolve(en),
	fr: () => import("./lang/fr").then((m) => m.fr),
} as const satisfies Record<string, () => Promise<Tr>>;

export const LangValues = Object.keys(dict) as Lang[];

export type Lang = keyof typeof dict;
