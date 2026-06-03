import type { TodoTr } from "@/features/todo/dict/lang/en";
import { todoApp } from "@/features/todo/logic";
import { useMemo, useRef } from "react";
import { TodoItem } from "./TodoItem";
import "./TodoList.css";

export type TodoListProps = { tr: TodoTr; selectedId?: string };

export const TodoList = ({ tr, selectedId }: TodoListProps) => {
	const items = todoApp.todos.data.use();
	const doneFilter = todoApp.todos.doneFilter.use();
	const search = todoApp.todos.search.use();
	const visibleTodos = useMemo(() => todoApp.todos.fn.todos.visible.get(items, doneFilter, search), [items, doneFilter, search]);
	const selectedRef = useRef<HTMLLIElement>(null);
	const editingData = todoApp.todos.editingData.use();

	todoApp.todos.effect.useScrollToSelectedId(selectedId, selectedRef);

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
