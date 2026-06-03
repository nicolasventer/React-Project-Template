import type { SharedTr } from "./lang/en";
import { sharedEn } from "./lang/en";

export const sharedDict = {
	en: () => Promise.resolve(sharedEn),
	fr: () => import("./lang/fr").then((m) => m.sharedFr),
} as const satisfies Record<string, () => Promise<SharedTr>>;

export const LangValues = Object.keys(sharedDict) as Lang[];

export type Lang = keyof typeof sharedDict;
