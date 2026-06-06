import { Counter } from "@/features/counter/components/Counter";
import type { Feature } from "@/shared/types/Feature";
import { createRoute } from "@/shared/types/Router";

declare global {
	interface RouterPathObj {
		"/counter?start?increment": "/counter?start?increment";
	}
}

export const CounterFeature: Feature = {
	route: createRoute("/counter?start?increment", Counter),
	link: "/counter?start=10&increment=5",
};
