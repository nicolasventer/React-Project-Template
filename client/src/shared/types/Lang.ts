export const LangValues = ["en", "fr"] as const;

export type Lang = (typeof LangValues)[number];
