import type { Tr } from "@/dict/lang/en";
import { app } from "@/logic";
import "./TodoNewForm.css";

export type TodoNewFormProps = { tr: Tr };

export const TodoNewForm = ({ tr }: TodoNewFormProps) => {
	const draft = app.todos.state.newTodo.use();

	return (
		<form
			className="row"
			onSubmit={(e) => {
				e.preventDefault();
				app.todos.todo.add(draft);
				app.todos.newTodo.update("");
			}}
		>
			<input
				className="field"
				value={draft}
				onChange={(e) => app.todos.newTodo.update(e.target.value)}
				placeholder={tr.TodoPlaceholder}
				autoComplete="off"
				aria-label={tr.TodoPlaceholder}
			/>
			<button type="submit" className="primary">
				{tr.TodoAdd}
			</button>
		</form>
	);
};
