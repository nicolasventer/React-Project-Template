import type { Tr } from "@/app/dict/lang/en";
import { en } from "@/app/dict/lang/en";
import type { Lang } from "@/shared/types/Lang";

export const dict = {
	en: () => Promise.resolve(en),
	fr: () => import("./lang/fr").then((m) => m.fr),
} as const satisfies Record<Lang, () => Promise<Tr>>;
