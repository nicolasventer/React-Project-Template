import type { RouteWithParams, RouteWithRender } from "@/shared/utils/BasicRouter";

declare global {
	interface RouterPathObj {
		"/": "/";
		"/404": "/404";
	}
}

export type RouterPath = RouterPathObj[keyof RouterPathObj];

export type AppRoute<T extends RouterPath> = RouteWithParams<T>;
export type AppRouteWithRender<T extends RouterPath> = RouteWithRender<T>;

export const createRoute = <T extends RouterPath>(path: AppRoute<T>["path"], Render: AppRouteWithRender<T>["Render"]) =>
	({ path, Render }) as AppRouteWithRender<RouterPath>;
