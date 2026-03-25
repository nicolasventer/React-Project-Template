import type { Tr } from "@/dict/lang/en";
import { app } from "@/logic";
import { useEffect, useMemo, useRef } from "react";
import { TodoItem } from "./TodoItem";
import "./TodoList.css";

export type TodoListProps = { tr: Tr; selectedId?: string };

export const TodoList = ({ tr, selectedId }: TodoListProps) => {
	const items = app.todos.state.data.use();
	const doneFilter = app.todos.state.doneFilter.use();
	const search = app.todos.state.search.use();
	const visibleTodos = useMemo(() => app.todos.visibleTodos.get(items, doneFilter, search), [items, doneFilter, search]);
	const selRef = useRef<HTMLLIElement>(null);

	useEffect(() => {
		if (selectedId && selRef.current) selRef.current.scrollIntoView({ block: "nearest", behavior: "smooth" });
	}, [selectedId, visibleTodos]);

	return (
		<ul className="todo-list">
			{!visibleTodos.length && !!items.length && <li className="todo-empty">{tr.TodoNoMatches}</li>}
			{visibleTodos.map((t) => (
				<TodoItem key={t.id} ref={t.id === selectedId ? selRef : undefined} tr={tr} todo={t} selected={t.id === selectedId} />
			))}
		</ul>
	);
};
