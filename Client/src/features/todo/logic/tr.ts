import { todoEn } from "@/features/todo/dict/lang/en";
import { store } from "@/utils/Store";

const state = {
	data: store(todoEn),
	isLoading: store(false),
};

export const tr = {
	...state,
	use: state.data.use, // shortcut since we use it so often
};
