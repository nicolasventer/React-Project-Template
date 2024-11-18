import { describe, expect, test } from "bun:test";
import { RouterTest } from "./RouterTest";

describe.skip("Router", () => {
	const { getCurrentRoute, isRouteVisible, buildRouteLink, RouterRender } = new RouterTest(
		[
			"/about",
			"?id",
			"//",
			"/",
			"/posts/:id",
			"/posts/",
			"/posts",
			"/client/:id/:name",
			"/client?name?age",
			"/client",
			"/client/",
		],
		["/", "/posts", "/client"]
	);

	test("getCurrentRoute", () => {
		expect(getCurrentRoute("/")).toEqual({ currentRoute: "/", routeParams: {} });
		expect(getCurrentRoute("/about")).toEqual({ currentRoute: "/about", routeParams: {} });
		expect(getCurrentRoute("/posts")).toEqual({ currentRoute: "/posts", routeParams: {} });
		expect(getCurrentRoute("/posts/")).toEqual({ currentRoute: "/posts", routeParams: {} });
		expect(getCurrentRoute("/posts/123")).toEqual({ currentRoute: "/posts/:id", routeParams: { id: "123" } });
		expect(getCurrentRoute("/posts/123/")).toEqual({ currentRoute: "/posts/:id", routeParams: { id: "123" } });
		expect(getCurrentRoute("/posts/123?name=abc")).toEqual({
			currentRoute: "/posts/:id",
			routeParams: { id: "123", name: "abc" },
		});
		expect(getCurrentRoute("/posts/123/?name=abc")).toEqual({
			currentRoute: "/posts/:id",
			routeParams: { id: "123", name: "abc" },
		});
		expect(getCurrentRoute("/client/123/abc")).toEqual({
			currentRoute: "/client/:id/:name",
			routeParams: { id: "123", name: "abc" },
		});
		expect(getCurrentRoute("/client/123/abc/")).toEqual({
			currentRoute: "/client/:id/:name",
			routeParams: { id: "123", name: "abc" },
		});
		expect(getCurrentRoute("/client?name=abc")).toEqual({ currentRoute: "/client?name?age", routeParams: { name: "abc" } });
		expect(getCurrentRoute("/client?age=123&name=abc")).toEqual({
			currentRoute: "/client?name?age",
			routeParams: { name: "abc", age: "123" },
		});
		expect(getCurrentRoute("/client/?name=abc")).toEqual({ currentRoute: "/client?name?age", routeParams: { name: "abc" } });
	});
	test("isRouteVisible", () => {
		expect(isRouteVisible("/", { currentRoute: "/" })).toBe(true);
		expect(isRouteVisible("/", { notFoundRoute: "/" })).toBe(true);
		expect(isRouteVisible("?id", { currentRoute: "?id" })).toBe(true);
		expect(isRouteVisible("/", { currentRoute: "?id" })).toBe(false);
		expect(isRouteVisible("/", { currentRoute: "/about" })).toBe(false);
		expect(isRouteVisible("/posts", { currentRoute: "/posts" })).toBe(true);
		expect(isRouteVisible("/posts", { notFoundRoute: "/posts" })).toBe(true);
		expect(isRouteVisible("/posts", { currentRoute: "/" })).toBe(false);
		expect(isRouteVisible("/posts/:id", { currentRoute: "/posts/:id" })).toBe(true);
		expect(isRouteVisible("/posts", { currentRoute: "/posts/:id" })).toBe(true);
		expect(isRouteVisible("/client", { currentRoute: "/client/:id/:name" })).toBe(true);
		expect(isRouteVisible("/client", { currentRoute: "/client?name?age" })).toBe(true);
		expect(isRouteVisible("/client?name?age", { currentRoute: "/client/:id/:name" })).toBe(false);
		expect(isRouteVisible("/client/:id/:name", { currentRoute: "/client?name?age" })).toBe(false);
	});
	test("buildRouteLink", () => {
		expect(buildRouteLink("/")).toBe("/");
		expect(buildRouteLink("?id", {})).toBe("/");
		expect(buildRouteLink("?id", { id: "123" })).toBe("/?id=123");
		expect(buildRouteLink("/about")).toBe("/about");
		expect(buildRouteLink("/posts")).toBe("/posts");
		expect(buildRouteLink("/posts/:id", { id: "123" })).toBe("/posts/123");
		expect(buildRouteLink("/client/:id/:name", { id: "123", name: "abc" })).toBe("/client/123/abc");
		expect(buildRouteLink("/client?name?age", { name: "abc" })).toBe("/client?name=abc");
		expect(buildRouteLink("/client?name?age", { age: "123", name: "abc" })).toBe("/client?name=abc&age=123");
		expect(buildRouteLink("/client?name?age", { name: "abc", age: "123" })).toBe("/client?name=abc&age=123");
	});
	test("RouterRender", () => {
		expect(RouterRender({ subPath: "/", currentRoute: "/" })).toBe("//");
		expect(RouterRender({ subPath: "/", notFoundRoute: "/" })).toBe("not-found-/");
		expect(RouterRender({ subPath: "/", currentRoute: "?id" })).toBe("?id");
		expect(RouterRender({ subPath: "/", currentRoute: "/about" })).toBe("/about");
		expect(RouterRender({ subPath: "/", currentRoute: "/posts" })).toBe("/posts");
		expect(RouterRender({ subPath: "/posts", currentRoute: "/posts" })).toBe("/posts/");
		expect(RouterRender({ subPath: "/posts", currentRoute: "/posts/:id" })).toBe("/posts/:id");
		expect(RouterRender({ subPath: "/posts", notFoundRoute: "/posts" })).toBe("not-found-/posts");
		expect(RouterRender({ subPath: "/", currentRoute: "/posts/:id" })).toBe("/posts");
		expect(RouterRender({ subPath: "/", currentRoute: "/client" })).toBe("/client");
		expect(RouterRender({ subPath: "/", currentRoute: "/client/:id/:name" })).toBe("/client");
		expect(RouterRender({ subPath: "/", currentRoute: "/client?name?age" })).toBe("/client");
		expect(RouterRender({ subPath: "/client", currentRoute: "/client" })).toBe("/client/");
		expect(RouterRender({ subPath: "/client", currentRoute: "/client/:id/:name" })).toBe("/client/:id/:name");
		expect(RouterRender({ subPath: "/client", currentRoute: "/client?name?age" })).toBe("/client?name?age");
	});
});

describe("Router2", () => {
	const { getCurrentRoute, isRouteVisible, buildRouteLink, RouterRender } = new RouterTest(
		[
			"?roomName?roomId?userName?userId",
			"/",
			"/reset",
			"/room?roomName?roomId",
			"/abc",
			"/abc?id",
			"/toto/:id",
			"/toto/3",
			"/toto/4153",
		],
		["/", "/abc"]
	);

	test.only("getCurrentRoute", () => {
		expect(getCurrentRoute("/")).toEqual({ currentRoute: "/", routeParams: {} });
		expect(getCurrentRoute("/toto/50")).toEqual({ currentRoute: "/toto/:id", routeParams: { id: "50" } });
		expect(getCurrentRoute("/toto/4153")).toEqual({ currentRoute: "/toto/4153", routeParams: {} });
		expect(getCurrentRoute("/toto/3")).toEqual({ currentRoute: "/toto/3", routeParams: {} });
	});
	test("isRouteVisible", () => {
		expect(isRouteVisible("/", { currentRoute: "/" })).toBe(true);
		expect(isRouteVisible("/", { notFoundRoute: "/" })).toBe(true);
		expect(
			isRouteVisible("?roomName?roomId?userName?userId", {
				currentRoute: "?roomName?roomId?userName?userId",
			})
		).toBe(true);
	});
	test("buildRouteLink", () => {
		expect(buildRouteLink("/")).toBe("/");
		expect(buildRouteLink("?roomName?roomId?userName?userId", {})).toBe("/");
	});
	test("RouterRender", () => {
		expect(RouterRender({ subPath: "/", currentRoute: "/" })).toBe("?roomName?roomId?userName?userId");
		expect(RouterRender({ subPath: "/", currentRoute: "/abc" })).toBe("/abc");
		expect(RouterRender({ subPath: "/abc", currentRoute: "/abc" })).toBe("/abc?id");
	});
});
