import type { Tr } from "@/dict/lang/en";
import { globalRef } from "@/globalRef";
import { navigateToRouteFn } from "@/routerInstance.gen";

// here kept in route.ts but would be better in todo.ts

const openTodoFn = (todoId: string) => () => {
	globalRef.lastOpenedTodoId = globalRef.currentTodoId;
	globalRef.currentTodoId = todoId;
	navigateToRouteFn("/todo?id", { id: todoId })();
};

const openLastOpenedTodoFn = (tr: Tr) => () => {
	if (globalRef.lastOpenedTodoId) openTodoFn(globalRef.lastOpenedTodoId)();
	else window.alert(tr.TodoOpenLastOpenedNone);
};

export const route = {
	todo: {
		openFn: openTodoFn,
		openLastOpenedFn: openLastOpenedTodoFn,
	},
};
