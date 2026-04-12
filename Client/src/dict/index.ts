import type { Tr } from "@/dict/lang/en";
import { en } from "@/dict/lang/en";

export const dict = {
	en: () => Promise.resolve(en),
	fr: () => import("./lang/fr").then((m) => m.fr),
} as const satisfies Record<string, () => Promise<Tr>>;

export const LangValues = Object.keys(dict) as Lang[];

export type Lang = keyof typeof dict;
