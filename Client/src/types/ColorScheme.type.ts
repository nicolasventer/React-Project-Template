export const COLOR_SCHEMES = ["light", "dark"] as const;
export type ColorSchemeType = (typeof COLOR_SCHEMES)[number];
