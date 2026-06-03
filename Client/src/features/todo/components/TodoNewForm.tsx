import type { TodoTr } from "@/features/todo/dict/lang/en";
import { todoApp } from "@/features/todo/logic";
import "./TodoNewForm.css";

export type TodoNewFormProps = { tr: TodoTr };

export const TodoNewForm = ({ tr }: TodoNewFormProps) => {
	const draft = todoApp.todos.newTodo.use();
	const randomLoading = todoApp.todos.randomTodo.loading.use();
	const randomError = todoApp.todos.randomTodo.error.use();

	return (
		<>
			<form
				className="row"
				onSubmit={(e) => {
					e.preventDefault();
					todoApp.todos.fn.todo.add(draft);
					todoApp.todos.fn.newTodo.update("");
				}}
			>
				<input
					className="field"
					value={draft}
					onChange={(e) => todoApp.todos.fn.newTodo.update(e.target.value)}
					placeholder={tr.todo.form.placeholder}
					autoComplete="off"
					aria-label={tr.todo.form.placeholder}
				/>
				<button type="submit" className="primary">
					{tr.todo.action.add}
				</button>
				<button
					type="button"
					className="todo-add-random"
					disabled={randomLoading}
					aria-busy={randomLoading}
					onClick={todoApp.todos.fn.todo.random.add}
				>
					{randomLoading ? tr.todo.status.addRandomLoading : tr.todo.action.addRandom}
				</button>
			</form>
			{randomError && (
				<p className="todo-add-random-error" role="alert">
					{tr.todo.status.addRandomFailed}
				</p>
			)}
		</>
	);
};
