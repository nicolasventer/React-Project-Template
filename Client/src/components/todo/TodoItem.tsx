import type { Tr } from "@/dict/lang/en";
import { app } from "@/logic";
import type { Todo } from "@/types/Todo.type";
import { forwardRef } from "react";
import "./TodoItem.css";

export type TodoItemProps = { tr: Tr; todo: Todo; selected: boolean };

export const TodoItem = forwardRef<HTMLLIElement, TodoItemProps>(function TodoItem({ tr, todo, selected }, ref) {
	const openAria = tr.TodoOpenAria.replace("{title}", todo.title);

	return (
		<li ref={ref} className={selected ? "todo-item todo-item-on" : "todo-item"}>
			<div className="row top">
				<label className="grow">
					<input
						type="checkbox"
						className="checkbox"
						checked={todo.done}
						onChange={() => app.todos.todo.toggle(todo.id)}
						aria-label={todo.title}
					/>
					<span className={todo.done ? "done" : undefined}>{todo.title}</span>
				</label>
				<button
					type="button"
					className={selected ? "link current" : "link"}
					aria-label={openAria}
					aria-current={selected ? "true" : undefined}
					title={openAria}
					onClick={app.route.todo.openFn(todo.id)}
				>
					{tr.TodoOpen}
				</button>
				<button type="button" className="danger" onClick={() => app.todos.todo.remove(todo.id)}>
					{tr.TodoDelete}
				</button>
			</div>
		</li>
	);
});
