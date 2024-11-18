/* eslint-disable no-mixed-spaces-and-tabs */

/**
 * @notExported
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
 * @notExported
 * Type to get the parameters of a route path.
 * @template {string} T The type of the route paths.
 */
type RouteParams_<T extends string> = (SplitPath<T> & `:${string}` extends never
	? {}
	: {
			[K in SplitPath<T> & `:${string}` extends `:${infer L}` ? L : never]: string;
	  }) &
	(SplitPath<T> & `?${string}` extends never
		? {}
		: {
				[K in SplitPath<T> & `?${string}` extends `?${infer L}` ? L : never]?: string;
		  });

/**
 * @notExported
 * Type of the parameters of a route path.
 * `params` is optional if the route has no parameters.
 * @template {string} RoutePath The type of the route paths.
 * @example
 * type A = RouteParams<"/a/:b/c?d">; // { b: string; d?: string; }
 */
type RouteParams<RoutePath extends string> = RouteParams_<RoutePath>;

/**
 * @notExported
 * Type to get the route path that should be accessible to the public.
 * @template {string} RoutePath The type of the route paths.
 */
type PublicRoutePath<RoutePath extends string> = RoutePath extends "/"
	? "/"
	: RoutePath extends `${infer _}/`
	? never
	: RoutePath;

/**
 * @notExported
 * Type of the parameters of the build link function. `params` is optional if the route has no parameters.
 * @template {string} RoutePath The type of the route paths.
 */
type BuildLinkParams<RoutePath extends string> = keyof RouteParams<RoutePath> extends never
	? [path: RoutePath]
	: [path: RoutePath, params: RouteParams<RoutePath>];

/**
 * @notExported
 * Type to get the subpaths of a route path.
 * @template {string} RoutePath The type of the route paths.
 * @example
 * type A = RoutePathWithSubPaths<"/a" | "/a/b/c">; // "/a"
 */
type RoutePathWithSubPaths<RoutePath extends string> = {
	[K in RoutePath]: K extends "/"
		? K
		: K extends `${infer _}/`
		? never
		: RoutePath extends `${K}${infer U}`
		? U extends ""
			? never
			: K
		: never;
}[RoutePath];

/**
 * @notExported
 * Type of the output of getCurrentRoute.
 * @template {string} RoutePath The type of the route paths.
 */
type CurrentRouteOutput<RoutePath extends string> = {
	/** The current route if found. */
	currentRoute?: PublicRoutePath<RoutePath>;
	/** The route closest to the current route if the current route is not found. */
	notFoundRoute?: PublicRoutePath<RoutePath>;
};

/**
 * @notExported
 * Type of the routeParams of the output of getCurrentRoute.
 * @template {string} RoutePath The type of the route paths.
 */
type RouteParamsOutput<RoutePath extends string> = {
	/** The parameters of the current route. */
	routeParams: {} | RouteParams<RoutePath>;
};

/**
 * Class used to test the router.
 * @template RoutePath The type of the route paths.
 */
export class RouterTest<RoutePath extends string> {
	private routerBaseRoute = "";
	// routes sorted by decreasing ':' then by alphabetical order then by decreasing length
	private routeRegexes: { path: RoutePath; regex: RegExp; keys: string[]; optionalKeys: string[] }[];
	private routesParentMap = new Map<RoutePath, PublicRoutePath<RoutePath>>(); // key is a path, value is the parent path

	/**
	 * Creates a new router instance.
	 * @param routes The routes of the app with their components.
	 * @param notFoundRoutes The routes of the app that are displayed when the current route is not found.
	 */
	constructor(private routes: RoutePath[], private notFoundRoutes: RoutePathWithSubPaths<PublicRoutePath<RoutePath>>[]) {
		this.routeRegexes = [...routes]
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
						.replace(/\?.*$/, "")}$`
				),
				keys: path.match(/:([^/]+)/g)?.map((s) => s.slice(1)) ?? [],
				optionalKeys: path.match(/\?([^/?]+)/g)?.map((s) => s.slice(1)) ?? [],
			}));

		for (const { path } of this.routeRegexes) {
			if (path === "/") continue;
			if (path.startsWith("?")) {
				this.routesParentMap.set(path, "/" as PublicRoutePath<RoutePath>); // we assume that "/" is always a RoutePath
				continue;
			}
			for (const { path: parentPath } of this.routeRegexes) {
				if (path === parentPath) continue;
				if (parentPath !== "/" && parentPath.endsWith("/")) continue;
				if (path.startsWith(parentPath)) {
					const oldParent = this.routesParentMap.get(path);
					if (oldParent && oldParent.length > parentPath.length) continue;
					this.routesParentMap.set(path, parentPath as PublicRoutePath<RoutePath>);
				}
			}
		}
	}

	/** Sets the base route of the router, should be called in the root file of the app (that call render and import the Main Layout component). */
	setRouterBaseRoute = (value: string) => {
		this.routerBaseRoute = value;
	};

	/** Get the current route based on the specified URL. */
	getCurrentRoute = (href: string): CurrentRouteOutput<RoutePath> & RouteParamsOutput<RoutePath> => {
		const url = new URL(href, "http://localhost");
		const path = url.pathname.replace(this.routerBaseRoute, "").replace(/\/$/, "") || "/";
		let routeRegex = this.routeRegexes.find(
			({ regex, optionalKeys }) => (url.search === "") === (optionalKeys.length === 0) && regex.test(path)
		);
		routeRegex ??= this.routeRegexes.find(({ regex }) => regex.test(path));
		if (!routeRegex) {
			const sortedSubPathArray = Object.keys(this.routes)
				.filter((a) => a === "/" || !a.endsWith("/"))
				.sort((a, b) => b.length - a.length);
			const sortedSubPath = sortedSubPathArray.find((subPath) => path.startsWith(subPath));
			const notFoundRoute = sortedSubPath as PublicRoutePath<RoutePath>;
			const routeParams = {};
			return { notFoundRoute, routeParams };
		}
		const currentRoute = routeRegex.path as PublicRoutePath<RoutePath>;
		const params = path.match(routeRegex.regex)!.slice(1);
		const routeParams = {} as any;
		routeRegex.keys.forEach((key, i) => (routeParams[key] = params[i]));
		const searchParams = new URLSearchParams(url.search);
		searchParams.forEach((value, key) => (routeParams[key] = value));
		return { currentRoute, routeParams: routeParams as RouteParams_<RoutePath> };
	};

	/** Whether the specified route is visible. */
	isRouteVisible = <T extends PublicRoutePath<RoutePath>>(
		path: T,
		{ currentRoute, notFoundRoute }: CurrentRouteOutput<RoutePath>
	) =>
		path === "/" || path.startsWith("?")
			? (currentRoute ?? notFoundRoute) === path
			: (currentRoute ?? notFoundRoute)?.startsWith(path);

	/** Builds a link to a route. */
	buildRouteLink = <T extends PublicRoutePath<RoutePath>>(...params: BuildLinkParams<T>) => {
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

	private getRouteToRender = (
		subPath: RoutePathWithSubPaths<PublicRoutePath<RoutePath>>,
		{ currentRoute, notFoundRoute }: CurrentRouteOutput<RoutePath>
	) => {
		const p = currentRoute ?? (notFoundRoute === subPath ? undefined : notFoundRoute);
		if (!p) return undefined;
		if (subPath === p) {
			const SlashComp = this.routes.find((path) => path === `${p}/`);
			if (SlashComp) return SlashComp;
			const p_ = p === "/" ? "" : p;
			for (const path of this.routes) if (path.startsWith(`${p_}?`)) return path;
			return undefined;
		}
		let result = p;
		let parent = this.routesParentMap.get(result as RoutePath);
		while (parent && parent !== subPath) {
			result = parent;
			parent = this.routesParentMap.get(result as RoutePath);
		}
		if (parent === subPath) return this.routes.find((path) => path === result);
		return undefined;
	};

	/**
	 * The component whose render depends on the current route.
	 * @param params
	 * @param params.subPath The subpath of the router to render, i.e. the path of the route layout.
	 * @returns The component that renders the current route.
	 */
	RouterRender = ({
		subPath,
		currentRoute,
		notFoundRoute,
	}: { subPath: RoutePathWithSubPaths<PublicRoutePath<RoutePath>> } & CurrentRouteOutput<RoutePath>) =>
		this.getRouteToRender(subPath, { currentRoute, notFoundRoute }) ?? this.NotFoundRouteRender({ subPath });

	private NotFoundRouteRender = ({ subPath }: { subPath: RoutePathWithSubPaths<PublicRoutePath<RoutePath>> }) =>
		`not-found-${this.notFoundRoutes.find((path) => path === subPath) ?? ""}` as const;
}
