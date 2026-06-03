import type { TodoTr } from "@/features/todo/dict/lang/en";
import { app } from "@/logic";

declare global {
	interface RoutePathObj {
		"/todo?id": "/todo?id";
	}
}

const ref = {
	currentTodoId: undefined as string | undefined,
	lastOpenedTodoId: undefined as string | undefined,
};

const openTodoFn = (todoId: string) => () => {
	ref.lastOpenedTodoId = ref.currentTodoId;
	ref.currentTodoId = todoId;
	app.route.fn.navigateToRouteFn("/todo?id", { id: todoId })();
};

const openLastOpenedTodoFn = (tr: TodoTr) => () => {
	if (ref.lastOpenedTodoId) openTodoFn(ref.lastOpenedTodoId)();
	else window.alert(tr.todo.status.openLastOpenedNone);
};

export const route = {
	ref: ref,
	fn: {
		todo: {
			openFn: openTodoFn,
			openLastOpenedFn: openLastOpenedTodoFn,
		},
	},
};
