import { AppLifeCycle } from "@/components/app/AppLifeCycle";
import type { Feature } from "@/featureRegister";
import { addLifeCycle, addRouteData } from "@/featureRegister";
import { Home } from "@/pages/Home";
import { NotFound } from "@/pages/NotFound";

declare global {
	interface AllFeatures {
		todo: Feature;
	}
}

export const todoFeature: Feature = {
	onLoad: () => {
		addRouteData({ path: "/", Render: Home });
		addRouteData({ path: "/404", Render: NotFound });
		addLifeCycle(AppLifeCycle);
	},
};
