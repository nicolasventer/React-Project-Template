import { counter } from "@/features/counter/logic/counter";

export const Counter = ({ start, increment }: { start?: string; increment?: string }) => {
	counter.fn.initState({ count: Number(start ?? 0) });
	const incrementAmount = Number(increment ?? 1);
	const count = counter.count.use();

	return (
		<div>
			Counter: {count}
			<button onClick={counter.fn.addToCountFn(incrementAmount)}>Increment</button>
			<button onClick={counter.fn.addToCountFn(-incrementAmount)}>Decrement</button>
		</div>
	);
};
