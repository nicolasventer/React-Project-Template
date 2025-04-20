import { useDebug } from "@/utils/GlobalDebugOneFile";

export const VARIANTS = ["filled", "light", "outline", "transparent", "white", "subtle", "default", "gradient"] as const;
export type Variant = (typeof VARIANTS)[number];
export const useDebugVariant = (name: string, defaultValue: Variant) =>
	useDebug("select", name, defaultValue, { options: VARIANTS });
