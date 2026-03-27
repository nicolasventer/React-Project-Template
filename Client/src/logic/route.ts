import type { Tr } from "@/dict/lang/en";
import { globalRef } from "@/globalRef";
import { store } from "@/utils/Store";

export type Route = { url: "/" } | { url: "/todo" } | { url: "/todo?:id"; id: string } | { url: "/404" };

const _getRouteFromCurrentUrl = (): Route => {
	if (window.location.pathname === "/") return { url: "/" };
	const searchParams = new URLSearchParams(window.location.search);
	if (window.location.pathname === "/todo") {
		const raw = searchParams.get("id");
		if (raw === null || raw === "") return { url: "/todo" };
		return { url: "/todo?:id", id: raw };
	}
	return { url: "/404" };
};

const _getUrlFromRoute = (route: Route) => {
	if (route.url === "/") return "/";
	if (route.url === "/todo") return "/todo";
	if (route.url === "/todo?:id") return `/todo?id=${encodeURIComponent(route.id)}`;
	return "/404";
};

const state = {
	route: store<Route>(_getRouteFromCurrentUrl()),
};

const navigateToRouteFn = (route: Route) => () => {
	window.history.pushState({}, "", _getUrlFromRoute(route));
	state.route.setValue(route, true);
};

const openTodoFn = (todoId: string) => () => {
	globalRef.lastOpenedTodoId = globalRef.currentTodoId;
	globalRef.currentTodoId = todoId;
	navigateToRouteFn({ url: "/todo?:id", id: todoId })();
};

const openLastOpenedTodoFn = (tr: Tr) => () => {
	if (globalRef.lastOpenedTodoId) openTodoFn(globalRef.lastOpenedTodoId)();
	else window.alert(tr.TodoOpenLastOpenedNone);
};

export const route = {
	state: state,
	navigateToRouteFn: navigateToRouteFn,
	todo: {
		openFn: openTodoFn,
		openLastOpenedFn: openLastOpenedTodoFn,
	},
};

window.addEventListener("popstate", () => {
	state.route.setValue(_getRouteFromCurrentUrl(), false);
});
