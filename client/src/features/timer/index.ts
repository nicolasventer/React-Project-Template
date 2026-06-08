import { Timer } from "@/features/timer/components/Timer";
import type { Feature } from "@/shared/types/Feature";
import { createRoute } from "@/shared/types/Router";

declare global {
	interface RouterPathObj {
		"/timer?interval": "/timer?interval";
	}
}

export const TimerFeature: Feature = {
	route: createRoute("/timer?interval", Timer),
	link: { path: "/timer?interval", params: { interval: "100" } },
};
