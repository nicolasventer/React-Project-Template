import type { Feature } from "@/featureRegister";
import { addLifeCycle, addRouteData } from "@/featureRegister";
import { TodoLifeCycle } from "@/features/todo/components/TodoLifeCycle";
import { TodoApp } from "@/features/todo/pages/Todo";

declare global {
	interface AllFeatures {
		todo: Feature;
	}
}

export const todoFeature: Feature = {
	onLoad: () => {
		addRouteData({ path: "/todo?id", Render: (r) => <TodoApp selectedId={r.id} /> });
		addLifeCycle(TodoLifeCycle);
	},
};
