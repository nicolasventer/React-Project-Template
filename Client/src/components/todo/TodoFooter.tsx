import type { Tr } from "@/dict/lang/en";
import { app } from "@/logic";
import type { DoneFilter, Todo } from "@/types/Todo.type";
import { DoneFilterValues } from "@/types/Todo.type";
import "./TodoFooter.css";

export type TodoFooterProps = { tr: Tr; items: Todo[] };

export const TodoFooter = ({ tr, items }: TodoFooterProps) => {
	const doneFilter = app.todos.doneFilter.use();

	const activeCount = items.filter((t) => !t.done).length;
	const doneCount = items.length - activeCount;

	const label = (f: DoneFilter) =>
		f === "all" ? tr.todo.label.filter.all : f === "active" ? tr.todo.label.filter.active : tr.todo.label.filter.completed;

	return (
		<footer className="todo-foot">
			<span>{tr.todo.status.itemsLeft.replace("{n}", String(activeCount))}</span>
			<div role="group" aria-label="Filter">
				{DoneFilterValues.map((f) => (
					<button
						key={f}
						type="button"
						className={doneFilter === f ? "pill on" : "pill"}
						onClick={() => app.todos.fn.doneFilter.update(f)}
					>
						{label(f)}
					</button>
				))}
			</div>
			{doneCount > 0 && (
				<button type="button" className="link clear" onClick={app.todos.fn.todos.completed.clear}>
					{tr.todo.action.clearCompleted}
				</button>
			)}
		</footer>
	);
};
