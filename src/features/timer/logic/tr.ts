import { en } from "@/features/timer/dict/lang/en";
import { store } from "@/shared/utils/Store";

const state = {
	data: store(en),
	isLoading: store(false),
};

export const tr = {
	...state,
	use: state.data.use,
};
