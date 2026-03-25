export const dict = {
	en: () => import("./lang/en").then((m) => m.en),
	fr: () => import("./lang/fr").then((m) => m.fr),
};

export const LangValues = Object.keys(dict) as Lang[];

export type Lang = keyof typeof dict;
