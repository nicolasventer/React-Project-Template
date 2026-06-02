import { STATIC_CONFIG } from "@/config/cliConfig";
import type { Tr } from "@/dict/lang/en";
import { BasicRouter } from "@/utils/BasicRouter";

const router = new BasicRouter(["/", "/todo?id", "/404"], true, "route");

router.setRouterBaseRoute(STATIC_CONFIG.BASE_URL);

const state = {
	route: router.getRouteStore(),
};

const ref = {
	currentTodoId: undefined as string | undefined,
	lastOpenedTodoId: undefined as string | undefined,
};

const openTodoFn = (todoId: string) => () => {
	ref.lastOpenedTodoId = ref.currentTodoId;
	ref.currentTodoId = todoId;
	router.navigateToRouteFn("/todo?id", { id: todoId })();
};

const openLastOpenedTodoFn = (tr: Tr) => () => {
	if (ref.lastOpenedTodoId) openTodoFn(ref.lastOpenedTodoId)();
	else window.alert(tr.todo.status.openLastOpenedNone);
};

export const route = {
	...state,
	ref: ref,
	fn: {
		navigateToRouteFn: router.navigateToRouteFn,
		todo: {
			openFn: openTodoFn,
			openLastOpenedFn: openLastOpenedTodoFn,
		},
	},
};
