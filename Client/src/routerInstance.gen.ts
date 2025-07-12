// 2f6280baa09d15e429b2648ee54719b7787d188d59fa9b09f7d43ce2052e7db4
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
		[checkValidRoute("/profile")]: lazySingleLoader(() => import("./routes/profile"), "Profile"),
		[checkValidRoute("/reset-password?token")]: lazySingleLoader(() => import("./routes/reset-password$token"), "ResetPasswordPage"),
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
