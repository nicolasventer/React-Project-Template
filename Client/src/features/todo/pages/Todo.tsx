import "@/components/todo/TodoCommon.css";
import { TodoAppHeader } from "@/features/todo/components/TodoAppHeader";
import { TodoFooter } from "@/features/todo/components/TodoFooter";
import { TodoList } from "@/features/todo/components/TodoList";
import { TodoNewForm } from "@/features/todo/components/TodoNewForm";
import { TodoSearchField } from "@/features/todo/components/TodoSearchField";
import { todoApp } from "@/features/todo/logic";
import "./Todo.css";

export type TodoAppProps = { selectedId?: string };

export const TodoApp = ({ selectedId }: TodoAppProps) => {
	const tr = todoApp.tr.use();

	const items = todoApp.todos.data.use();

	return (
		<div className="todo-app">
			<TodoAppHeader tr={tr} />
			<main>
				<h1>{tr.todo.heading.title}</h1>
				<TodoNewForm tr={tr} />
				{!!items.length && <TodoSearchField tr={tr} />}
				<TodoList tr={tr} selectedId={selectedId} />
				{!!items.length && <TodoFooter tr={tr} items={items} />}
			</main>
		</div>
	);
};
