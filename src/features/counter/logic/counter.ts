import type { RecursiveTypeOfStore } from "@/shared/utils/Store";
import { store } from "@/shared/utils/Store";
import { doOnceFn } from "@/shared/utils/utils";

const state = {
	count: store(0),
};
type CounterState = RecursiveTypeOfStore<typeof state>;

const initCounterState = doOnceFn(({ count }: CounterState) => {
	state.count.setValue(count);
});

const addToCountFn = (amount: number) => () => state.count.setValue((v) => v + amount);

export const counter = {
	...state,
	fn: {
		initState: initCounterState,
		addToCountFn: addToCountFn,
	},
};
