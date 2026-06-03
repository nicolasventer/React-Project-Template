import { sharedEn } from "@/shared/dict/lang/en";
import { store } from "@/utils/Store";

const state = {
	data: store(sharedEn),
	isLoading: store(false),
};

export const tr = {
	...state,
	use: state.data.use, // shortcut since we use it so often
};
