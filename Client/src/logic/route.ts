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

export const route = {
	state: state,
	navigateToRouteFn: navigateToRouteFn,
};

window.addEventListener("popstate", () => {
	state.route.setValue(_getRouteFromCurrentUrl(), false);
});
