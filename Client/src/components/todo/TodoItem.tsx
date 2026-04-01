import type { Tr } from "@/dict/lang/en";
import { app } from "@/logic";
import type { Todo } from "@/types/Todo.type";
import { forwardRef, useEffect, useRef } from "react";
import "./TodoItem.css";

export type TodoItemProps = { tr: Tr; todo: Todo; selected: boolean; draft: string | undefined };

export const TodoItem = forwardRef<HTMLLIElement, TodoItemProps>(function TodoItem({ tr, todo, selected, draft }, ref) {
	const isEditing = draft !== undefined;
	const openAria = tr.TodoOpenAria.replace("{title}", todo.title);
	const editAria = tr.TodoEditAria.replace("{title}", todo.title);
	const inputRef = useRef<HTMLInputElement>(null);

	useEffect(() => {
		if (isEditing && inputRef.current) {
			inputRef.current.focus();
			inputRef.current.select();
		}
	}, [isEditing]);

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
						disabled={isEditing}
					/>
					{isEditing ? (
						<input
							ref={inputRef}
							type="text"
							className="field todo-item-edit-field"
							value={draft}
							aria-label={editAria}
							onChange={(e) => app.todos.todo.editing.start(todo.id, e.target.value)}
							onKeyDown={app.todos.todo.editing.onKeyDownFn(todo.id, draft)}
							onBlur={() => app.todos.commit.blur(todo.id, draft)}
						/>
					) : (
						<span
							className={todo.done ? "done" : undefined}
							onDoubleClick={() => app.todos.todo.editing.start(todo.id, todo.title)}
						>
							{todo.title}
						</span>
					)}
				</label>
				{isEditing ? (
					<button
						type="button"
						className="link"
						aria-label={tr.Cancel}
						title={tr.Cancel}
						onMouseDown={app.todos.commit.skipBlur}
						onClick={() => app.todos.todo.editing.stop(todo.id)}
					>
						{tr.Cancel}
					</button>
				) : (
					<>
						<button
							type="button"
							className="link"
							aria-label={editAria}
							title={editAria}
							onClick={() => app.todos.todo.editing.start(todo.id, todo.title)}
						>
							{tr.TodoEdit}
						</button>
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
					</>
				)}
				<button type="button" className="danger" onClick={() => app.todos.todo.remove(todo.id)}>
					{tr.TodoDelete}
				</button>
			</div>
		</li>
	);
});
