import { STATIC_CONFIG } from "@/config/cliConfig";
import type { Tr } from "@/dict/lang/en";
import { globalRef } from "@/globalRef";
import { BasicRouter } from "@/utils/BasicRouter";

const router = new BasicRouter(["/", "/todo?id", "/404"], true);

router.setRouterBaseRoute(STATIC_CONFIG.BASE_URL);

const state = {
	route: router.getRouteStore(),
};

const openTodoFn = (todoId: string) => () => {
	globalRef.lastOpenedTodoId = globalRef.currentTodoId;
	globalRef.currentTodoId = todoId;
	router.navigateToRouteFn("/todo?id", { id: todoId })();
};

const openLastOpenedTodoFn = (tr: Tr) => () => {
	if (globalRef.lastOpenedTodoId) openTodoFn(globalRef.lastOpenedTodoId)();
	else window.alert(tr.TodoOpenLastOpenedNone);
};

export const route = {
	state: state,
	navigateToRouteFn: router.navigateToRouteFn,
	todo: {
		openFn: openTodoFn,
		openLastOpenedFn: openLastOpenedTodoFn,
	},
};
