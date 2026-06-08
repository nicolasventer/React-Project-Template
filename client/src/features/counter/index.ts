import { Counter } from "@/features/counter/components/Counter";
import type { Feature } from "@/shared/types/Feature";
import { createRoute } from "@/shared/types/Router";

declare global {
	interface RouterPathObj {
		"/counter?start": "/counter?start";
	}
}

export const CounterFeature: Feature = {
	route: createRoute("/counter?start", Counter),
	link: { path: "/counter?start", params: { start: "10" } },
};
