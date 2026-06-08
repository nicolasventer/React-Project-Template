import type { Lang } from "@/shared/types/Lang";
import type { Tr } from "@/features/counter/dict/lang/en";
import { en } from "@/features/counter/dict/lang/en";

export const dict = {
	en: () => Promise.resolve(en),
	fr: () => import("./lang/fr").then((m) => m.fr),
} as const satisfies Record<Lang, () => Promise<Tr>>;
