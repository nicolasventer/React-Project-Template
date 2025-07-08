import { type RouterPathType } from "@/routerInstance.gen";
import { CodeIcon, HomeIcon } from "lucide-react";
import type { ReactNode } from "react";
import { BsListStars } from "react-icons/bs";

export const pages = [
	{ title: "Home", path: "/", icon: HomeIcon },
	{ title: "Features", path: "/features", icon: BsListStars },
	{ title: "Code features", path: "/code-features", icon: CodeIcon },
] as const satisfies { title: string; path: RouterPathType; icon: (props: { size: number }) => ReactNode }[];
