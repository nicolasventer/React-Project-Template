/* eslint-disable @typescript-eslint/no-empty-object-type */
import { flushSync } from "react-dom";
import type { Store } from "./Store";
import { store } from "./Store";

/**
 * Type to split a path into its parts.
 * @template {string} T The type of the route paths.
 */
type SplitPath<T extends string, Prefix extends ":" | "?" | "/" | "" = ""> = T extends `${infer U}:${infer V}`
	? SplitPath<U, Prefix> | SplitPath<V, ":">
	: T extends `${infer U}?${infer V}`
		? SplitPath<U, Prefix> | SplitPath<V, "?">
		: T extends `${infer U}/${infer V}`
			? SplitPath<U, Prefix> | SplitPath<V, "/">
			: T extends ``
				? never
				: `${Prefix}${T}`;

/**
 * Type of the parameters of a route path.
 * `params` is optional if the route has no parameters.
 * @template {string} RoutePath The type of the route paths.
 * @example
 * type A = RouteParams<"/a/:b/c?d">; // { b: string; d?: string; }
 */
type RouteParams<RoutePath extends string> = (SplitPath<RoutePath> & `:${string}` extends never
	? {}
	: {
			[K in SplitPath<RoutePath> & `:${string}` extends `:${infer L}` ? L : never]: string;
		}) &
	(SplitPath<RoutePath> & `?${string}` extends never
		? {}
		: {
				[K in SplitPath<RoutePath> & `?${string}` extends `?${infer L}` ? L : never]?: string;
			});

/**
 * Type of the parameters of the build link function. `params` is optional if the route has no parameters.
 * @template {string} RoutePath The type of the route paths.
 */
export type BuildLinkParams<RoutePath extends string> = keyof RouteParams<RoutePath> extends never
	? [path: RoutePath]
	: [path: RoutePath, params: RouteParams<RoutePath>];

/**
 * Discriminated union of a route path and its typed parameters.
 * `params` are inferred from path segments (`:param`) and query string (`?param`).
 * @template {string} RoutePath The union of route path literals.
 * @example
 * type Route = RouteWithParams<"/counter" | "/user/:id">;
 * // { path: "/counter"; params: {} } | { path: "/user/:id"; params: { id: string } }
 */
export type RouteWithParams<RoutePath extends string> = {
	[key in RoutePath]: { path: key; params: RouteParams<key> };
}[RoutePath];

/**
 * Discriminated union of a route path and its render function.
 * `Render` receives parameters typed from the route path.
 * @template {string} RoutePath The union of route path literals.
 * @example
 * type Feature = RouteWithRender<"/counter" | "/user/:id">;
 * // { path: "/counter"; Render: (params: {}) => React.ReactNode }
 * // | { path: "/user/:id"; Render: (params: { id: string }) => React.ReactNode }
 */
export type RouteWithRender<RoutePath extends string> = {
	[key in RoutePath]: { path: key; Render: (params: RouteParams<key>) => React.ReactNode };
}[RoutePath];

/**
 * Class that handles routing in a React app.
 * @template RoutePath The type of the route paths.
 */
export class BasicRouter<RoutePath extends string> {
	public $type = {
		routePath: "" as RoutePath,
	};

	private routerBaseRoute = undefined as unknown as string;
	private currentRoute: Store<RouteWithParams<RoutePath>>;
	private localPath = "";

	// routes sorted by decreasing ':' then by alphabetical order then by decreasing length
	private routeRegexes: { path: RoutePath; regex: RegExp; keys: string[]; optionalKeys: string[] }[];

	/**
	 * Creates a new router instance.
	 * @param routePathList The list of route paths.
	 * @param isGlobal Whether the router is global. If true, the router will use window.location.href to update the current route and will listen to popstate events.
	 */
	constructor(
		routePathList: RoutePath[],
		private isGlobal: boolean,
		private debugLabel?: string,
		public bUseRouteTransition = true,
	) {
		this.currentRoute = store<RouteWithParams<RoutePath>>(
			{ path: "", params: {} } as RouteWithParams<RoutePath>,
			this.debugLabel,
		);
		this.routeRegexes = routePathList
			.sort((a, b) => {
				for (let i = 0; i < Math.min(a.length, b.length); i++) {
					const ca = a[i];
					const cb = b[i];
					if (ca === cb) continue;
					if (ca === ":") return 1;
					if (cb === ":") return -1;
					return ca.localeCompare(cb);
				}
				return b.length - a.length;
			})
			.map((path) => ({
				path: path as RoutePath,
				regex: new RegExp(
					`^${path
						// Replace :[^/]* with ([^/]+)
						.replace(/:[^/]*/g, "([^/]+)")
						// Replace start ? with /?
						.replace(/^\?/, "/?")
						// Replace ?.* with nothing
						.replace(/\?.*$/, "")}$`,
				),
				keys: path.match(/:([^/]+)/g)?.map((s) => s.slice(1)) ?? [],
				optionalKeys: path.match(/\?([^/?]+)/g)?.map((s) => s.slice(1)) ?? [],
			}));
		if (isGlobal) {
			window.addEventListener("popstate", () => {
				if (this.bUseRouteTransition) document.startViewTransition(() => flushSync(this.updateCurrentRoute_));
				else this.updateCurrentRoute_();
			});
			this.updateCurrentRoute_();
		}
	}

	/** Sets the base route of the router, should be called in the root file of the app. */
	setRouterBaseRoute = (value: string) => {
		if (this.routerBaseRoute === value) return;
		this.routerBaseRoute = value;
		this.updateCurrentRoute_();
	};

	/**
	 * Updates the current route based on the current URL or local path.
	 * Called within {@link setRouterBaseRoute}, {@link navigateToRouteFn} and {@link navigateToCustomRouteFn}.
	 * If no registered route matches the pathname, sets the route to `"/404"` with `params.path` set to the unmatched path.
	 */
	private updateCurrentRoute_ = () => {
		const url = this.isGlobal
			? new URL(window.location.href)
			: new URL(`http://x${this.routerBaseRoute}${this.localPath.replace(/^\/?/, "")}`);
		const path = url.pathname.replace(this.routerBaseRoute, "").replace(/\/$/, "") || "/";
		let routeRegex = this.routeRegexes.find(
			({ regex, optionalKeys }) => (url.search === "") === (optionalKeys.length === 0) && regex.test(path),
		);
		routeRegex ??= this.routeRegexes.find(({ regex }) => regex.test(path));
		if (!routeRegex) {
			this.currentRoute.setValue({ path: "/404", params: { path: path } } as unknown as RouteWithParams<RoutePath>);
			return;
		}
		const params = path.match(routeRegex.regex)!.slice(1);
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		const routeParams = {} as any;
		routeRegex.keys.forEach((key, i) => (routeParams[key] = params[i]));
		const searchParams = new URLSearchParams(url.search);
		searchParams.forEach((value, key) => (routeParams[key] = value));
		this.currentRoute.setValue({ path: routeRegex.path, params: routeParams ?? {} } as RouteWithParams<RoutePath>);
	};

	/** Returns the current route store. */
	getRouteStore = () => this.currentRoute;

	/** Builds a link to a route. */
	buildRouteLink = <T extends RoutePath>(...params: BuildLinkParams<T>) => {
		const [path, p] = params;
		if (!p) return `${this.routerBaseRoute}${path}`;
		const routeRegex = this.routeRegexes.find(({ path: p }) => p === (path as unknown as RoutePath));
		if (!routeRegex) return `${this.routerBaseRoute}${path}`; // Should never happen
		let result: string = path;
		for (const key of routeRegex.keys) {
			const value = p[key as keyof typeof p] as string | undefined;
			if (!value) throw new Error(`Missing param ${key}`);
			result = result.replace(`:${key}`, encodeURIComponent(value));
		}
		const searchParams = new URLSearchParams();
		for (const key of routeRegex.optionalKeys) {
			const value = p[key as keyof typeof p] as string | undefined;
			if (value) searchParams.set(key, value);
			result = result.replace(`?${key}`, "");
		}
		if (result === "") result = "/";
		const search = searchParams.toString();
		if (search) result += `?${search}`;
		return `${this.routerBaseRoute}${result}`;
	};

	/**
	 * Navigates to a route.
	 * @param params The path and parameters of the route to navigate to.
	 * @returns A function that navigates to the route using the current route transition setting.
	 */
	navigateToRouteFn =
		<T extends RoutePath>(...params: BuildLinkParams<T>) =>
		(ev?: { preventDefault: () => void }) => {
			ev?.preventDefault();
			const navigateFn = () => {
				const [path, p] = params;
				this.currentRoute.setValue({ path: path, params: p ?? {} } as RouteWithParams<RoutePath>);
				const link = this.buildRouteLink(...(params as BuildLinkParams<T>));
				const link2 = link === "//" ? "/" : link; // this is a hack
				if (this.localPath) this.localPath = link2;
				else window.history.pushState({}, "", link2 || "/");
			};
			if (this.bUseRouteTransition) document.startViewTransition(() => flushSync(navigateFn));
			else navigateFn();
		};

	/**
	 * Navigates to a URL and updates the current route.
	 * @param url The URL to navigate to.
	 * @returns A function that navigates to the URL using the current route transition setting.
	 */
	navigateToCustomRouteFn = (url: string) => (ev?: { preventDefault: () => void }) => {
		ev?.preventDefault();
		const navigateFn = () => {
			if (this.isGlobal) window.history.pushState({}, "", url);
			else this.localPath = url;
			this.updateCurrentRoute_();
		};
		if (this.bUseRouteTransition) document.startViewTransition(() => flushSync(navigateFn));
		else navigateFn();
	};
}
