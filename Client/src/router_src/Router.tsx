/* eslint-disable no-mixed-spaces-and-tabs */
import { batch, effect, signal, type ReadonlySignal, type Signal } from "@preact/signals";
import type { ComponentPropsWithoutRef, JSX, ReactNode } from "react";
import { flushSync } from "react-dom";
import { LazySingleLoaderReturn } from "./lazyLoader";
import { useReact } from "./useReact";

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
 * Type of a registered route.
 */
type RouteValue = LazySingleLoaderReturn<() => JSX.Element>;

/**
 * @notExported
 * Type to store the routes of the app. \
 * The keys are the paths of the routes and the values are the components of the routes.
 * @template {string} T The type of the route paths.
 */
type Routes<T extends string> = Record<T, RouteValue>;

/**
 * Type of the parameters of a route path.
 * `params` is optional if the route has no parameters.
 * @template {string} RoutePath The type of the route paths.
 * @example
 * type A = RouteParams<"/a/:b/c?d">; // { b: string; d?: string; }
 */
export type RouteParams<RoutePath extends string> = RouteParams_<RoutePath>;

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
 * The props of the link component.
 * `params` is optional if the route has no parameters.
 * @template {string} RoutePath The type of the route paths.
 */
export type LinkProps<RoutePath extends string> = keyof RouteParams<RoutePath> extends never
	? {
			/** The path of the route to link to. */
			path: PublicRoutePath<RoutePath>;
			/** The parameters of the route. */
			params?: {};
	  }
	: {
			/** The path of the route to link to. */
			path: PublicRoutePath<RoutePath>;
			/** The parameters of the route. */
			params: RouteParams<RoutePath>;
	  };

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
 * Class that handles routing in a React app.
 * @template RoutePath The type of the route paths.
 */
export class Router<RoutePath extends string> {
	private routerBaseRoute = "";
	private useRouteTransition_ = true;
	private currentRoute_ = signal<PublicRoutePath<RoutePath>>();
	private notFoundRoute_ = signal<PublicRoutePath<RoutePath>>();
	private routeParams_ = signal<RouteParams<RoutePath> | {}>({});
	// routes sorted by decreasing ':' then by alphabetical order then by decreasing length
	private routeRegexes: { path: RoutePath; regex: RegExp; keys: string[]; optionalKeys: string[] }[];
	private routesParentMap = new Map<RoutePath, PublicRoutePath<RoutePath>>(); // key is a path, value is the parent path

	/**
	 * Creates a new router instance.
	 * @param routes The routes of the app with their components.
	 * @param notFoundRoutes The routes of the app that are displayed when the current route is not found.
	 * @param urlSignal Signal that simulates the URL for the router instance. This should start with '/'.
	 */
	constructor(
		private routes: Routes<RoutePath>,
		private notFoundRoutes: Partial<Routes<RoutePathWithSubPaths<PublicRoutePath<RoutePath>>>>,
		private urlSignal?: Signal<string>
	) {
		this.routeRegexes = Object.keys(routes)
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
		if (urlSignal) effect(() => this.updateCurrentRoute());
		else window.addEventListener("popstate", () => this.updateCurrentRoute());
	}

	/** Hook need in React that should be called in the Main Layout component if its render depends on current route or loading state. */
	useRoutes = () => {
		useReact(this.currentRoute_);
		useReact(this.notFoundRoute_);
		useReact(this.routeParams_);
		// eslint-disable-next-line react-hooks/rules-of-hooks
		for (const route of Object.values(this.routes)) useReact((route as LazySingleLoaderReturn<() => ReactNode>).loadingState);
		return null;
	};

	/** Sets the base route of the router, should be called in the root file of the app (that call render and import the Main Layout component). */
	setRouterBaseRoute = (value: string) => {
		this.routerBaseRoute = value;
		this.updateCurrentRoute();
	};

	/** Sets if the router should use transitions when navigating to a new route. */
	setUseRouteTransition = (value: boolean) => (this.useRouteTransition_ = value);

	/** Updates the current route based on the current URL. It is called automatically when the app starts and when {@link navigateToRouteFn} is called. */
	updateCurrentRoute = () => {
		const urlSignalSlash = this.urlSignal?.value?.startsWith("/") ? "" : "/";
		const url = this.urlSignal?.value
			? new URL(`http://x${this.routerBaseRoute}${urlSignalSlash}${this.urlSignal.value}`)
			: new URL(window.location.href);
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
			this.currentRoute_.value = undefined;
			this.notFoundRoute_.value = sortedSubPath as PublicRoutePath<RoutePath>;
			this.routeParams_.value = {};
			return;
		}
		this.currentRoute_.value = routeRegex.path as PublicRoutePath<RoutePath>;
		this.notFoundRoute_.value = undefined;
		const params = path.match(routeRegex.regex)!.slice(1);
		const routeParams = {} as any;
		routeRegex.keys.forEach((key, i) => (routeParams[key] = params[i]));
		const searchParams = new URLSearchParams(url.search);
		searchParams.forEach((value, key) => (routeParams[key] = value));
		this.routeParams_.value = routeParams ?? {};
	};

	/** The current route of the app. It is set to undefined if the route is not found (see {@link notFoundRoute}). */
	currentRoute = this.currentRoute_ as ReadonlySignal<PublicRoutePath<RoutePath>>;

	/** The route that is displayed when the current route is not found. */
	notFoundRoute = this.notFoundRoute_ as ReadonlySignal<PublicRoutePath<RoutePath>>;

	/** The parameters of the current route. */
	getRouteParams = <T extends PublicRoutePath<RoutePath>>(_: T) => this.routeParams_ as ReadonlySignal<RouteParams<T>>;

	/** Whether the current route is visible. */
	isRouteVisible = <T extends PublicRoutePath<RoutePath>>(path: T) =>
		path === "/" || path.startsWith("?")
			? (this.currentRoute_.value ?? this.notFoundRoute_.value) === path
			: (this.currentRoute_.value ?? this.notFoundRoute_.value)?.startsWith(path);

	/** Whether the current route is loading. */
	isRouteLoading = (path: PublicRoutePath<RoutePath>) => this.routes[path as RoutePath]?.loadingState.value === "loading";

	/** Whether the current route is loaded. */
	isRouteLoaded = (path: PublicRoutePath<RoutePath>) => this.routes[path as RoutePath]?.loadingState.value === "loaded";

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

	/**
	 * Starts loading a route if it is not already loaded.
	 * @param path The path of the route to load.
	 * @returns A function that starts loading the route and returns a promise that resolves when the route is loaded.
	 */
	loadRouteFn =
		<T extends PublicRoutePath<RoutePath>>(path: T) =>
		() =>
			this.routes[path as unknown as RoutePath]?.load();

	/**
	 * Navigates to a route.
	 * @param params The path and parameters of the route to navigate to.
	 * @returns A function that navigates to the route using the current route transition setting.
	 */
	navigateToRouteFn =
		<T extends PublicRoutePath<RoutePath>>(...params: BuildLinkParams<T>) =>
		(ev?: Event) => {
			ev?.preventDefault();
			const navigateFn = () => {
				const [path, p] = params;
				batch(() => {
					this.currentRoute_.value = path;
					this.routeParams_.value = p ?? {};
				});
				const link = this.buildRouteLink(...(params as BuildLinkParams<T>));
				const link2 = link === "//" ? "/" : link; // this is a hack
				if (this.urlSignal) this.urlSignal.value = link2;
				else window.history.pushState({}, "", link2 || "/");
			};
			if (this.useRouteTransition_) document.startViewTransition(() => flushSync(navigateFn));
			else navigateFn();
		};

	/** The component that renders a link to a route. */
	RouteLink = <T extends PublicRoutePath<RoutePath>>({
		path,
		params,
		children,
		...props
	}: LinkProps<T> & ComponentPropsWithoutRef<"a">) => (
		<a
			{...props}
			href={this.buildRouteLink(...([path, params] as unknown as BuildLinkParams<T>))}
			onClick={this.navigateToRouteFn(...([path, params] as unknown as BuildLinkParams<T>))}
		>
			{children}
		</a>
	);

	private getComponentToRender = (subPath: RoutePathWithSubPaths<PublicRoutePath<RoutePath>>) => {
		const p = this.currentRoute_.value ?? (this.notFoundRoute_.value === subPath ? undefined : this.notFoundRoute_.value);
		if (!p) return undefined;
		if (subPath === p) {
			const SlashComp = this.routes[`${p}/` as RoutePath]?.Component;
			if (SlashComp) return SlashComp;
			const p_ = p === "/" ? "" : p;
			for (const [path, { Component }] of Object.entries<RouteValue>(this.routes))
				if (path.startsWith(`${p_}?`)) return Component;
			return undefined;
		}
		let result = p;
		let parent = this.routesParentMap.get(result as RoutePath);
		while (parent && parent !== subPath) {
			result = parent;
			parent = this.routesParentMap.get(result as RoutePath);
		}
		if (parent === subPath) return this.routes[result as RoutePath]?.Component;
		return undefined;
	};

	/**
	 * The component whose render depends on the current route.
	 * @param params
	 * @param params.subPath The subpath of the router to render, i.e. the path of the route layout.
	 * @returns The component that renders the current route.
	 */
	RouterRender = ({ subPath }: { subPath: RoutePathWithSubPaths<PublicRoutePath<RoutePath>> }) => (
		<>
			{this.useRoutes()}
			{this.getComponentToRender(subPath)?.() ?? this.NotFoundRouteRender({ subPath })}
		</>
	);

	private NotFoundRouteRender = ({ subPath }: { subPath: RoutePathWithSubPaths<PublicRoutePath<RoutePath>> }) =>
		this.notFoundRoutes[subPath]?.Component() ?? null;
}
