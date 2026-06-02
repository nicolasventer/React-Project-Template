import type { Tr } from "@/dict/lang/en";
import { app } from "@/logic";
import { useMemo, useRef } from "react";
import { TodoItem } from "./TodoItem";
import "./TodoList.css";

export type TodoListProps = { tr: Tr; selectedId?: string };

export const TodoList = ({ tr, selectedId }: TodoListProps) => {
	const items = app.todos.data.use();
	const doneFilter = app.todos.doneFilter.use();
	const search = app.todos.search.use();
	const visibleTodos = useMemo(() => app.todos.fn.todos.visible.get(items, doneFilter, search), [items, doneFilter, search]);
	const selectedRef = useRef<HTMLLIElement>(null);
	const editingData = app.todos.editingData.use();

	app.todos.effect.useScrollToSelectedId(selectedId, selectedRef);

	return (
		<ul className="todo-list">
			{!visibleTodos.length && !!items.length && <li className="todo-empty">{tr.todo.status.noMatches}</li>}
			{visibleTodos.map((t) => (
				<TodoItem
					key={t.id}
					ref={t.id === selectedId ? selectedRef : undefined}
					tr={tr}
					todo={t}
					selected={t.id === selectedId}
					draft={editingData[t.id]}
				/>
			))}
		</ul>
	);
};
