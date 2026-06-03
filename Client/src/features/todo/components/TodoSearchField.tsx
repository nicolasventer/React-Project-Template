import type { TodoTr } from "@/features/todo/dict/lang/en";
import { todoApp } from "@/features/todo/logic";
import "./TodoSearchField.css";

export type TodoSearchFieldProps = { tr: TodoTr };

export const TodoSearchField = ({ tr }: TodoSearchFieldProps) => {
	const search = todoApp.todos.search.use();

	return (
		<input
			className="field query"
			type="search"
			value={search}
			onChange={(e) => todoApp.todos.fn.search.update(e.target.value)}
			placeholder={tr.todo.form.searchPlaceholder}
			autoComplete="off"
			aria-label={tr.todo.form.searchPlaceholder}
		/>
	);
};
