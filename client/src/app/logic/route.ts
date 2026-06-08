import { enabledFeatures } from "@/app/featureRegister";
import { B_PROD } from "@/shared/Config";
import type { RouterPath } from "@/shared/types/Router";
import { BasicRouter } from "@/shared/utils/BasicRouter";

const router = new BasicRouter<RouterPath>(
	["/", "/404", ...enabledFeatures.map((feature) => feature.route.path)],
	true,
	"router",
);

router.setRouterBaseRoute(B_PROD ? "/React-Project-Template" : "");

const state = {
	router: router.getRouteStore(),
};

const navigateToRouteFn = router.navigateToRouteFn;
const navigateToCustomRouteFn = router.navigateToCustomRouteFn;
const buildRouteLink = router.buildRouteLink;

export const route = {
	...state,
	fn: {
		navigateToRouteFn,
		navigateToCustomRouteFn,
		buildRouteLink,
	},
};
