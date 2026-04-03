import type { Tr } from "@/dict/lang/en";
import { app } from "@/logic";
import "./TodoNewForm.css";

export type TodoNewFormProps = { tr: Tr };

export const TodoNewForm = ({ tr }: TodoNewFormProps) => {
	const draft = app.todos.state.newTodo.use();
	const randomLoading = app.todos.state.randomTodo.loading.use();
	const randomError = app.todos.state.randomTodo.error.use();

	return (
		<>
			<form
				className="row"
				onSubmit={(e) => {
					e.preventDefault();
					app.todos.fn.todo.add(draft);
					app.todos.fn.newTodo.update("");
				}}
			>
				<input
					className="field"
					value={draft}
					onChange={(e) => app.todos.fn.newTodo.update(e.target.value)}
					placeholder={tr.TodoPlaceholder}
					autoComplete="off"
					aria-label={tr.TodoPlaceholder}
				/>
				<button type="submit" className="primary">
					{tr.TodoAdd}
				</button>
				<button
					type="button"
					className="todo-add-random"
					disabled={randomLoading}
					aria-busy={randomLoading}
					onClick={app.todos.fn.todo.random.add}
				>
					{randomLoading ? tr.TodoAddRandomLoading : tr.TodoAddRandom}
				</button>
			</form>
			{randomError && (
				<p className="todo-add-random-error" role="alert">
					{tr.TodoAddRandomFailed}
				</p>
			)}
		</>
	);
};
