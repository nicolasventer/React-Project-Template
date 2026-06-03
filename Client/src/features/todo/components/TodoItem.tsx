import type { TodoTr } from "@/features/todo/dict/lang/en";
import { todoApp } from "@/features/todo/logic";
import type { Todo } from "@/features/todo/types/Todo.type";
import { forwardRef, useRef } from "react";
import "./TodoItem.css";

export type TodoItemProps = { tr: TodoTr; todo: Todo; selected: boolean; draft: string | undefined };

export const TodoItem = forwardRef<HTMLLIElement, TodoItemProps>(function TodoItem({ tr, todo, selected, draft }, ref) {
	const isEditing = draft !== undefined;
	const openAria = tr.todo.aria.openTask.replace("{title}", todo.title);
	const editAria = tr.todo.aria.editTask.replace("{title}", todo.title);
	const inputRef = useRef<HTMLInputElement>(null);

	todoApp.todos.effect.useFocusOnEdit(isEditing, inputRef);

	return (
		<li ref={ref} className={selected ? "todo-item todo-item-on" : "todo-item"}>
			<div className="row top">
				<label className="grow">
					<input
						type="checkbox"
						className="checkbox"
						checked={todo.done}
						onChange={() => todoApp.todos.fn.todo.toggle(todo.id)}
						aria-label={todo.title}
						disabled={isEditing}
					/>
					{isEditing ? (
						<input
							ref={inputRef}
							type="text"
							className="field todo-item-edit-field"
							value={draft}
							aria-label={editAria}
							onChange={(e) => todoApp.todos.fn.todo.editing.start(todo.id, e.target.value)}
							onKeyDown={todoApp.todos.fn.todo.editing.onKeyDownFn(todo.id, draft)}
							onBlur={() => todoApp.todos.fn.commit.blur(todo.id, draft)}
						/>
					) : (
						<span
							className={todo.done ? "done" : undefined}
							onDoubleClick={() => todoApp.todos.fn.todo.editing.start(todo.id, todo.title)}
						>
							{todo.title}
						</span>
					)}
				</label>
				{isEditing ? (
					<button
						type="button"
						className="link"
						aria-label={tr.todo.action.cancel}
						title={tr.todo.action.cancel}
						onMouseDown={todoApp.todos.fn.commit.skipBlur}
						onClick={() => todoApp.todos.fn.todo.editing.stop(todo.id)}
					>
						{tr.todo.action.cancel}
					</button>
				) : (
					<>
						<button
							type="button"
							className="link"
							aria-label={editAria}
							title={editAria}
							onClick={() => todoApp.todos.fn.todo.editing.start(todo.id, todo.title)}
						>
							{tr.todo.action.edit}
						</button>
						<button
							type="button"
							className={selected ? "link current" : "link"}
							aria-label={openAria}
							aria-current={selected ? "true" : undefined}
							title={openAria}
							onClick={todoApp.route.fn.todo.openFn(todo.id)}
						>
							{tr.todo.action.open}
						</button>
					</>
				)}
				<button type="button" className="danger" onClick={() => todoApp.todos.fn.todo.remove(todo.id)}>
					{tr.todo.action.delete}
				</button>
			</div>
		</li>
	);
});
