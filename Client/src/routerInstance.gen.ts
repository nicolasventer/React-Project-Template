// 3e8372024d2ac77e04fdcb86ea5bb4c6062901313306db0ee04e3969cc1ee065
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
		[checkValidRoute("//")]: lazySingleLoader(() => import("./routes/index.index"), "Home"),
		[checkValidRoute("/")]: lazySingleLoader(() => import("./routes/index.lazy"), "MainLayout"),
		[checkValidRoute("/login")]: lazySingleLoader(() => import("./routes/login"), "LoginPage"),
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
