export const dict = {
	en: () => import("@/tr/en").then((m) => m.en),
	fr: () => import("@/tr/fr").then((m) => m.fr),
};

export const LangValues = Object.keys(dict) as Lang[];

export type Lang = keyof typeof dict;
