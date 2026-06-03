import type { TodoTr } from "./lang/en";
import { todoEn } from "./lang/en";

export const todoDict = {
	en: () => Promise.resolve(todoEn),
	fr: () => import("./lang/fr").then((m) => m.todoFr),
} as const satisfies Record<string, () => Promise<TodoTr>>;

export const LangValues = Object.keys(todoDict) as Lang[];

export type Lang = keyof typeof todoDict;
