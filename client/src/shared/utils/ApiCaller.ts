/* eslint-disable @typescript-eslint/no-empty-object-type */

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

type ApiRequestInit = Omit<RequestInit, "method" | "body">;

type KeysWithValues<T extends object> = {
	[K in keyof T]: keyof T[K] extends never ? never : K;
}[keyof T];

type MethodsNoBody = "get" | "delete" | "get_text" | "delete_text";
type MethodsWithBody = "put" | "post" | "patch" | "put_text" | "post_text" | "patch_text";
type Methods = MethodsNoBody | MethodsWithBody;

type Api<
	T extends {
		[K in Methods]: K extends MethodsNoBody
			? Record<string, unknown> // path, response
			: Record<string, [unknown, unknown]>; // path, [body, response]
	},
> = {
	[K in KeysWithValues<T>]: K extends MethodsNoBody
		? {
				[L in keyof T[K] & string]: keyof RouteParams<L> extends never
					? (requestInit?: ApiRequestInit) => Promise<T[K][L]>
					: (params: RouteParams<L>, requestInit?: ApiRequestInit) => Promise<T[K][L]>;
			}
		: K extends MethodsWithBody
			? {
					[L in keyof T[K] & string]: keyof RouteParams<L> extends never
						? (body: T[K][L][0], requestInit?: ApiRequestInit) => Promise<T[K][L][1]>
						: (params: RouteParams<L>, body: T[K][L][0], requestInit?: ApiRequestInit) => Promise<T[K][L][1]>;
				}
			: never;
};

/**
 * Builds a concrete route URL from a route template and params.
 *
 * Required route segments use `:param`, optional query params use `?param`.
 * Example template: `/users/:id?includePosts`
 */
const buildRouteLink = (baseUrl: string, path: string, p: Record<string, string>) => {
	if (!p) return `${baseUrl}${path}`;
	const keys = path.match(/:([^/]+)/g)?.map((s) => s.slice(1)) ?? [];
	const optionalKeys = path.match(/\?([^/?]+)/g)?.map((s) => s.slice(1)) ?? [];
	let result: string = path;
	for (const key of keys) {
		const value = p[key as keyof typeof p] as string | undefined;
		if (!value) throw new Error(`Missing param ${key}`);
		result = result.replace(`:${key}`, encodeURIComponent(value));
	}
	const searchParams = new URLSearchParams();
	for (const key of optionalKeys) {
		const value = p[key as keyof typeof p] as string | undefined;
		if (value) searchParams.set(key, value);
		result = result.replace(`?${key}`, "");
	}
	if (result === "") result = "/";
	const search = searchParams.toString();
	if (search) result += `?${search}`;
	return `${baseUrl}${result}`;
};

type BuildFnParams =
	| [requestInit: ApiRequestInit]
	| [params: Record<string, string>, requestInit: ApiRequestInit]
	| [params: Record<string, string>, body: unknown, requestInit: ApiRequestInit]
	| [body: unknown, requestInit: ApiRequestInit];

/**
 * Creates a proxy-backed request handler for a route path.
 *
 * The path is an array of two elements: the HTTP method and the route template.
 */
const buildFn =
	(baseUrl: string, defaultRequestInit: ApiRequestInit, path: string[]) =>
	async (...buildFnParams: BuildFnParams) => {
		const [method, routeTemplate] = path;
		const routeHasParams = /:([^/]+)/.test(routeTemplate) || /\?([^/?]+)/.test(routeTemplate);
		const [params, body, requestInit] = (
			method === "get" || method === "delete" || method === "get_text" || method === "delete_text"
				? routeHasParams || buildFnParams.length === 2
					? [buildFnParams[0], undefined, buildFnParams[1] ?? {}]
					: [undefined, undefined, buildFnParams[0]]
				: routeHasParams || buildFnParams.length === 3
					? [buildFnParams[0], buildFnParams[1], buildFnParams[2] ?? {}]
					: [undefined, buildFnParams[0], buildFnParams[1]]
		) as [params: Record<string, string>, body: unknown, requestInit: ApiRequestInit];
		const url = buildRouteLink(baseUrl, routeTemplate, params);
		const bodyObject = body ? { body: JSON.stringify(body) } : {};
		const res = await fetch(url, {
			method: method.replace("_text", "").toUpperCase(),
			...bodyObject,
			...defaultRequestInit,
			...requestInit,
		});
		return method.includes("text") ? res.text() : res.json();
	};

/**
 * Recursively creates a proxy that captures accessed properties as route parts until it is called as a function.
 */
const BuildProxy = <T extends object>(baseUrl: string, defaultRequestInit: ApiRequestInit, path: string[]): T =>
	new Proxy<T>(buildFn(baseUrl, defaultRequestInit, path) as T, {
		get: (_, prop: string) => BuildProxy<T>(baseUrl, defaultRequestInit, [...path, prop]),
	});

/**
 * Fluent type-safe API client builder.
 *
 * Add endpoints by method, then call `build()` to create a runtime client with strongly typed params, body, and response values.
 *
 * @example
 * type User = { id: string; name: string };
 * type CreateUserBody = { name: string };
 *
 * const api = new ApiCaller()
 * 	.get<"/users/:id", User>()
 * 	.get<"/users?search", User[]>()
 * 	.post<"/users", CreateUserBody, User>()
 * 	.delete_text<"/users/:id">()
 * 	.build("https://api.example.com/v1", {
 * 		headers: { "Content-Type": "application/json" },
 * 	});
 *
 * // GET https://api.example.com/v1/users/42
 * const user = await api.get["/users/:id"]({ id: "42" });
 *
 * // GET https://api.example.com/v1/users?search=alice
 * const users = await api.get["/users?search"]({ search: "alice" });
 *
 * // POST https://api.example.com/v1/users
 * const created = await api.post["/users"]({ name: "Alice" });
 *
 * // DELETE https://api.example.com/v1/users/42 (expects a text response)
 * const message = await api.delete_text["/users/:id"]({ id: "42" });
 */
export class ApiCaller<
	T extends {
		[K in Methods]: K extends MethodsNoBody ? Record<string, unknown> : Record<string, [unknown, unknown]>;
	} = {
		get: {};
		delete: {};
		put: {};
		post: {};
		patch: {};
		get_text: {};
		delete_text: {};
		put_text: {};
		post_text: {};
		patch_text: {};
	},
> {
	/**
	 * Registers a JSON `GET` route.
	 * @template U Route template (for example `"/users/:id"`).
	 * @template TResponse Parsed JSON response type.
	 */
	get = <U extends string, TResponse>() =>
		new ApiCaller<{ [K in keyof T]: T[K] & (K extends "get" ? { [_ in U]: TResponse } : {}) }>();

	/**
	 * Registers a JSON `DELETE` route.
	 * @template U Route template (for example `"/users/:id"`).
	 * @template TResponse Parsed JSON response type.
	 */
	delete = <U extends string, TResponse>() =>
		new ApiCaller<{ [K in keyof T]: T[K] & (K extends "delete" ? { [_ in U]: TResponse } : {}) }>();

	/**
	 * Registers a JSON `PUT` route.
	 * @template U Route template (for example `"/users/:id"`).
	 * @template TBody Request body type.
	 * @template TResponse Parsed JSON response type.
	 */
	put = <U extends string, TBody, TResponse>() =>
		new ApiCaller<{ [K in keyof T]: T[K] & (K extends "put" ? { [_ in U]: [TBody, TResponse] } : {}) }>();

	/**
	 * Registers a JSON `POST` route.
	 * @template U Route template (for example `"/users"`).
	 * @template TBody Request body type.
	 * @template TResponse Parsed JSON response type.
	 */
	post = <U extends string, TBody, TResponse>() =>
		new ApiCaller<{ [K in keyof T]: T[K] & (K extends "post" ? { [_ in U]: [TBody, TResponse] } : {}) }>();

	/**
	 * Registers a JSON `PATCH` route.
	 * @template U Route template (for example `"/users/:id"`).
	 * @template TBody Request body type.
	 * @template TResponse Parsed JSON response type.
	 */
	patch = <U extends string, TBody, TResponse>() =>
		new ApiCaller<{ [K in keyof T]: T[K] & (K extends "patch" ? { [_ in U]: [TBody, TResponse] } : {}) }>();

	/**
	 * Registers a text `GET` route.
	 * @template U Route template.
	 */
	get_text = <U extends string>() =>
		new ApiCaller<{ [K in keyof T]: T[K] & (K extends "get_text" ? { [_ in U]: string } : {}) }>();

	/**
	 * Registers a text `DELETE` route.
	 * @template U Route template.
	 */
	delete_text = <U extends string>() =>
		new ApiCaller<{ [K in keyof T]: T[K] & (K extends "delete_text" ? { [_ in U]: string } : {}) }>();

	/**
	 * Registers a text `PUT` route.
	 * @template U Route template.
	 * @template TBody Request body type.
	 */
	put_text = <U extends string, TBody>() =>
		new ApiCaller<{ [K in keyof T]: T[K] & (K extends "put_text" ? { [_ in U]: [TBody, string] } : {}) }>();

	/**
	 * Registers a text `POST` route.
	 * @template U Route template.
	 * @template TBody Request body type.
	 */
	post_text = <U extends string, TBody>() =>
		new ApiCaller<{ [K in keyof T]: T[K] & (K extends "post_text" ? { [_ in U]: [TBody, string] } : {}) }>();

	/**
	 * Registers a text `PATCH` route.
	 * @template U Route template.
	 * @template TBody Request body type.
	 */
	patch_text = <U extends string, TBody>() =>
		new ApiCaller<{ [K in keyof T]: T[K] & (K extends "patch_text" ? { [_ in U]: [TBody, string] } : {}) }>();

	/**
	 * Returns a typed client that runs `fetch` for each registered route.
	 * `baseUrl` is prepended to route templates; `defaultRequestInit` is merged into every request.
	 *
	 * @param baseUrl Base URL for requests (`""` = same-origin relative URLs).
	 * @param defaultRequestInit Default `fetch` options for all calls.
	 * @returns Typed API client for this builder’s routes.
	 *
	 * @example
	 * type User = { id: string; name: string };
	 * type CreateUserBody = { name: string };
	 *
	 * const api = new ApiCaller()
	 * 	.get<"/users/:id", User>()
	 * 	.get<"/users?search", User[]>()
	 * 	.post<"/users", CreateUserBody, User>()
	 * 	.delete_text<"/users/:id">()
	 * 	.build("https://api.example.com/v1", {
	 * 		headers: { "Content-Type": "application/json" },
	 * 	});
	 *
	 * // GET https://api.example.com/v1/users/42
	 * const user = await api.get["/users/:id"]({ id: "42" });
	 *
	 * // GET https://api.example.com/v1/users?search=alice
	 * const users = await api.get["/users?search"]({ search: "alice" });
	 *
	 * // POST https://api.example.com/v1/users
	 * const created = await api.post["/users"]({ name: "Alice" });
	 *
	 * // DELETE https://api.example.com/v1/users/42 (expects a text response)
	 * const message = await api.delete_text["/users/:id"]({ id: "42" });
	 */
	build = (baseUrl: string = "", defaultRequestInit: ApiRequestInit = {}) => BuildProxy<Api<T>>(baseUrl, defaultRequestInit, []);
}
