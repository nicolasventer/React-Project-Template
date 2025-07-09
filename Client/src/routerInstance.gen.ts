// 468869b322f97d0d328a903452d5d1faa25ab1dcdf1f16d1c4951991cbb9ffb9
import { checkValidRoute, lazySingleLoader, type RouteParams, Router } from "easy-react-router";

export const {
	RouteCustomLink,
	RouteLink,
	RouterRender,
	useRouteRender,
	buildRouteLink,
	useCurrentRoute,
	useRouteParams,
	useLoadingState,
	useUrlState,
	loadRouteFn,
	navigateToCustomRouteFn,
	navigateToRouteFn,
	setRouterBaseRoute,
	setUseRouteTransition,
	updateCurrentRoute,
} = new Router(
	{
		[checkValidRoute("/")]: lazySingleLoader(() => import("./routes/index.lazy"), "MainLayout"),
	},
	{
		[checkValidRoute("/")]: lazySingleLoader(() => import("./routes/404"), "NotFoundPage"),
	},
	true
);

/** The type of the route paths. */
export type RouterPathType = NonNullable<ReturnType<typeof useCurrentRoute>["currentRoute"]>;
/**
 * @template {string} RoutePath
 * Type of the parameters of a route path.
 * `params` is optional if the route has no parameters.
 * @example
 * type A = RouterParamsType<"/a/:b/c?d">; // { b: string; d?: string; }
 */
export type RouterParamsType<T extends RouterPathType> = RouteParams<T>;

updateCurrentRoute();
