import { api } from "@/api/api";
import { initialLocalStorageState } from "@/localStorage";
import type { DoneFilter, Todo } from "@/types/Todo.type";
import { store } from "@/utils/Store";
import { wait } from "@/utils/utils";
import type { KeyboardEvent, RefObject } from "react";
import { useEffect } from "react";

const state = {
	data: store(initialLocalStorageState.todos),
	editingData: store<Record<string, string | undefined>>({}), // id -> title
	newTodo: store(""),
	doneFilter: store<DoneFilter>("all"),
	search: store(""),
	randomTodo: {
		loading: store(false),
		error: store<Error | null>(null),
	},
};

const addRandomTodo = () => {
	state.randomTodo.error.setValue(null);
	state.randomTodo.loading.setValue(true);
	return wait(1000)
		.then(() => api.get_text["/api/lorem"]())
		.then(addTodo)
		.catch((error) => state.randomTodo.error.setValue(error))
		.finally(() => state.randomTodo.loading.setValue(false));
};

const addTodo = (title: string) => {
	const t = title.trim();
	if (!t) return;
	state.data.setValue((s) => [...s, { id: crypto.randomUUID(), title: t, done: false }]);
};
const stopEditingTodo = (id: string) => {
	state.editingData.setValue(({ [id]: _, ...rest }) => rest);
};
const removeTodo = (id: string) => {
	stopEditingTodo(id);
	state.data.setValue((s) => s.filter((t) => t.id !== id));
};
const toggleTodo = (id: string) => {
	state.data.setValue((s) => s.map((t) => (t.id === id ? { ...t, done: !t.done } : t)));
};
const startEditingTodo = (id: string, title: string) => {
	state.editingData.setValue((s) => ({ ...s, [id]: title }));
};
const validateEditingTodo_ = (id: string, title: string | undefined) => {
	state.data.setValue((s) => s.map((t) => (t.id === id ? { ...t, title: title ?? t.title } : t)));
	stopEditingTodo(id);
};
const commitEditingTodo_ = (id: string, title: string | undefined) => {
	const t = title?.trim() ?? "";
	if (t) validateEditingTodo_(id, t);
	else stopEditingTodo(id);
};
const onKeyDownFn = (id: string, draft: string | undefined) => (e: KeyboardEvent<HTMLInputElement>) => {
	if (e.key === "Enter") {
		e.preventDefault();
		commitEditingTodo_(id, draft);
	} else if (e.key === "Escape") {
		e.preventDefault();
		stopEditingTodo(id);
	}
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

const ref = {
	blurCommit: {
		skip: false,
	},
};

const skipBlurCommit = () => {
	ref.blurCommit.skip = true;
};

const blurCommit = (id: string, draft: string | undefined) => {
	if (ref.blurCommit.skip) {
		ref.blurCommit.skip = false;
		return;
	}
	commitEditingTodo_(id, draft);
};

const useFocusOnEdit = (isEditing: boolean, inputRef: RefObject<HTMLInputElement | null>) => {
	useEffect(() => {
		if (isEditing && inputRef.current) {
			inputRef.current.focus();
			inputRef.current.select();
		}
	}, [isEditing, inputRef]);
};

const useScrollToSelectedId = (selectedId: string | undefined, selectedRef: RefObject<HTMLLIElement | null>) =>
	useEffect(() => {
		if (selectedId && selectedRef.current) selectedRef.current.scrollIntoView({ block: "nearest", behavior: "smooth" });
	}, [selectedId, selectedRef]);

export const todos = {
	state: state,
	ref: ref,
	fn: {
		todo: {
			add: addTodo,
			remove: removeTodo,
			toggle: toggleTodo,
			editing: {
				start: startEditingTodo,
				stop: stopEditingTodo,
				onKeyDownFn: onKeyDownFn,
			},
			random: {
				add: addRandomTodo,
			},
		},
		todos: {
			completed: {
				clear: clearCompletedTodos,
			},
			visible: {
				get: getVisibleTodos,
			},
		},
		doneFilter: {
			update: updateDoneFilter,
		},
		search: {
			update: updateSearch,
		},
		newTodo: {
			update: updateNewTodo,
		},
		commit: {
			blur: blurCommit,
			skipBlur: skipBlurCommit,
		},
	},
	effect: {
		useFocusOnEdit: useFocusOnEdit,
		useScrollToSelectedId: useScrollToSelectedId,
	},
};
