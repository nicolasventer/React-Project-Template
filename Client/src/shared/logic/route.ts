import { STATIC_CONFIG } from "@/config/cliConfig";
import { BasicRouter } from "@/utils/BasicRouter";

declare global {
	interface RoutePathObj {
		"/": "/";
		"/404": "/404";
	}
}

export type RoutePath = keyof RoutePathObj;

const router = new BasicRouter<RoutePath>(["/", "/404"], true, "route");

router.setRouterBaseRoute(STATIC_CONFIG.BASE_URL);

const state = {
	route: router.getRouteStore(),
};

export const route = {
	...state,
	fn: {
		navigateToRouteFn: router.navigateToRouteFn,
	},
};
