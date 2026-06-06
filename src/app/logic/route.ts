import { enabledFeatures } from "@/app/featureRegister";
import type { RouterPath } from "@/shared/types/Router";
import { BasicRouter } from "@/shared/utils/BasicRouter";

const router = new BasicRouter<RouterPath>(
	enabledFeatures.map((feature) => feature.route.path),
	true,
);

const state = {
	router: router.getRouteStore(),
};

export const route = {
	...state,
};
