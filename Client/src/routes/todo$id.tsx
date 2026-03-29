import { TodoAppHeader } from "@/components/todo/TodoAppHeader";
import "@/components/todo/TodoCommon.css";
import { TodoFooter } from "@/components/todo/TodoFooter";
import { TodoList } from "@/components/todo/TodoList";
import { TodoNewForm } from "@/components/todo/TodoNewForm";
import { TodoSearchField } from "@/components/todo/TodoSearchField";
import { app } from "@/logic";
import { useRouteParams } from "@/routerInstance.gen";
import "./todo$id.css";

export const TodoApp = () => {
	const { id } = useRouteParams("/todo?id");

	const tr = app.tr.use();

	return (
		<div className="todo-app">
			<TodoAppHeader tr={tr} />
			<main>
				<h1>{tr.TodoTitle}</h1>
				<TodoNewForm tr={tr} />
				<TodoSearchField tr={tr} />
				<TodoList tr={tr} selectedId={id} />
				<TodoFooter tr={tr} />
			</main>
		</div>
	);
};
