import { TodoAppHeader } from "@/components/todo/TodoAppHeader";
import "@/components/todo/TodoCommon.css";
import { TodoFooter } from "@/components/todo/TodoFooter";
import { TodoList } from "@/components/todo/TodoList";
import { TodoNewForm } from "@/components/todo/TodoNewForm";
import { TodoSearchField } from "@/components/todo/TodoSearchField";
import { app } from "@/logic";
import "./Todo.css";

export type TodoAppProps = { selectedId?: string };

export const TodoApp = ({ selectedId }: TodoAppProps) => {
	const tr = app.tr.use();

	const items = app.todos.state.data.use();

	return (
		<div className="todo-app">
			<TodoAppHeader tr={tr} />
			<main>
				<h1>{tr.todo.heading.title}</h1>
				<TodoNewForm tr={tr} />
				{items.length && <TodoSearchField tr={tr} />}
				<TodoList tr={tr} selectedId={selectedId} />
				{items.length && <TodoFooter tr={tr} items={items} />}
			</main>
		</div>
	);
};
