import type { Tr } from "@/dict/lang/en";
import { app } from "@/logic";
import "./TodoSearchField.css";

export type TodoSearchFieldProps = { tr: Tr };

export const TodoSearchField = ({ tr }: TodoSearchFieldProps) => {
	const search = app.todos.search.use();

	return (
		<input
			className="field query"
			type="search"
			value={search}
			onChange={(e) => app.todos.fn.search.update(e.target.value)}
			placeholder={tr.todo.form.searchPlaceholder}
			autoComplete="off"
			aria-label={tr.todo.form.searchPlaceholder}
		/>
	);
};
