import { en } from "@/app/dict/lang/en";
import { store } from "@/shared/utils/Store";

const state = {
	data: store(en),
	isLoading: store(false),
};

export const tr = {
	...state,
	use: state.data.use, // shortcut since we use it so often
};
