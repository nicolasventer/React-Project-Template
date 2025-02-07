// 46114287767612e1d26fdcf5fb4a9f45d695ed3106079c9ce7e5122f78b9c7c9
import { checkValidRoute, lazySingleLoader, type RouteParams, Router } from "easy-react-router";

export const {
	RouteCustomLink,
	RouteLink,
	RouterRender,
	buildRouteLink,
	/** The current route of the app. It is set to undefined if the route is not found (see {@link notFoundRoute}). */
	currentRoute,
	getRouteParams,
	isRouteLoaded,
	isRouteLoading,
	isRouteVisible,
	loadRouteFn,
	navigateToCustomRouteFn,
	navigateToRouteFn,
	/** The route that is displayed when the current route is not found. */
	notFoundRoute,
	setRouterBaseRoute,
	setUseRouteTransition,
	updateCurrentRoute,
	useRoutes,
} = new Router(
	{
		[checkValidRoute("//")]: lazySingleLoader(() => import("./routes/index.index"), "HomePage"),
		[checkValidRoute("/")]: lazySingleLoader(() => import("./routes/index"), "MainLayout"),
	},
	{
		[checkValidRoute("/")]: lazySingleLoader(() => import("./routes/404"), "NotFoundPage"),
	}
);

/** The type of the route paths. */
export type RouterPathType = typeof currentRoute.value;
/**
 * @template {string} RoutePath
 * Type of the parameters of a route path.
 * `params` is optional if the route has no parameters.
 * @example
 * type A = RouteParams<"/a/:b/c?d">; // { b: string; d?: string; }
 */
export type RouterParamsType<T extends RouterPathType> = RouteParams<T>;

updateCurrentRoute();
