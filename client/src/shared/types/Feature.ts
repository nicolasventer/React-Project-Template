import type { AppRoute, AppRouteWithRender, RouterPath } from "@/shared/types/Router";

export type Feature = {
	route: AppRouteWithRender<RouterPath>;
	link: AppRoute<RouterPath>;
};
