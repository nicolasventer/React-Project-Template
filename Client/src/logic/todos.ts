import { initialLocalStorageState } from "@/localStorage";
import type { DoneFilter, Todo } from "@/types/Todo.type";
import { store } from "@/utils/Store";

const state = {
	data: store(initialLocalStorageState.todos),
	newTodo: store(""),
	doneFilter: store<DoneFilter>("all"),
	search: store(""),
};

const addTodo = (title: string) => {
	const t = title.trim();
	if (!t) return;
	state.data.setValue((s) => [...s, { id: crypto.randomUUID(), title: t, done: false }]);
};
const removeTodo = (id: string) => {
	state.data.setValue((s) => s.filter((t) => t.id !== id));
};
const toggleTodo = (id: string) => {
	state.data.setValue((s) => s.map((t) => (t.id === id ? { ...t, done: !t.done } : t)));
};
const updateTodo = (id: string, title: string) => {
	state.data.setValue((s) => s.map((t) => (t.id === id ? { ...t, title } : t)));
};

const clearCompletedTodos = () => {
	state.data.setValue((s) => s.filter((t) => !t.done));
};

const updateNewTodo = (newTodo: string) => {
	state.newTodo.setValue(newTodo);
};

const updateDoneFilter = (filter: DoneFilter) => {
	state.doneFilter.setValue(filter);
};

const updateSearch = (search: string) => {
	state.search.setValue(search);
};

const getVisibleTodos = (todos: Todo[], doneFilter: DoneFilter, search: string) => {
	let a = todos;
	if (doneFilter === "active") a = a.filter((t) => !t.done);
	else if (doneFilter === "completed") a = a.filter((t) => t.done);
	const q = search.trim().toLowerCase();
	if (q) a = a.filter((t) => t.title.toLowerCase().includes(q));
	return a;
};

export const todos = {
	state: state,
	todo: {
		add: addTodo,
		remove: removeTodo,
		toggle: toggleTodo,
		update: updateTodo,
		clearCompleted: clearCompletedTodos,
	},
	doneFilter: {
		update: updateDoneFilter,
	},
	search: {
		update: updateSearch,
	},
	visibleTodos: {
		get: getVisibleTodos,
	},
	newTodo: {
		update: updateNewTodo,
	},
};
