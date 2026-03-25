import type { Tr } from "@/dict/lang/en";
import { app } from "@/logic";
import type { DoneFilter } from "@/types/Todo.type";
import { DoneFilterValues } from "@/types/Todo.type";
import "./TodoFooter.css";

export type TodoFooterProps = { tr: Tr };

export const TodoFooter = ({ tr }: TodoFooterProps) => {
	const items = app.todos.state.data.use();
	const doneFilter = app.todos.state.doneFilter.use();

	if (!items.length) return null;

	const activeCount = items.filter((t) => !t.done).length;
	const doneCount = items.length - activeCount;

	const label = (f: DoneFilter) => (f === "all" ? tr.TodoAll : f === "active" ? tr.TodoActive : tr.TodoCompleted);

	return (
		<footer className="todo-foot">
			<span>{tr.TodoItemsLeft.replace("{n}", String(activeCount))}</span>
			<div role="group" aria-label="Filter">
				{DoneFilterValues.map((f) => (
					<button
						key={f}
						type="button"
						className={doneFilter === f ? "pill on" : "pill"}
						onClick={() => app.todos.doneFilter.update(f)}
					>
						{label(f)}
					</button>
				))}
			</div>
			{doneCount > 0 && (
				<button type="button" className="link clear" onClick={() => app.todos.todo.clearCompleted()}>
					{tr.TodoClearCompleted}
				</button>
			)}
		</footer>
	);
};
