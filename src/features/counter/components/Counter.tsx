import { config } from "@/bootstrap/config";
import { CounterLifeCycle } from "@/features/counter/components/CounterLifeCycle";
import { counter } from "@/features/counter/logic/counter";
import { tr } from "@/features/counter/logic/tr";

export const Counter = ({ start }: { start?: string }) => {
	counter.fn.initState({ count: Number(start ?? 0) });
	const incrementAmount = config.features.counter.specific?.increment ?? 1;
	const count = counter.count.use();
	const trV = tr.use();

	return (
		<>
			<CounterLifeCycle />
			<div>
				{trV.counter.label}: {count}
				<button onClick={counter.fn.addToCountFn(incrementAmount)}>{trV.counter.increment}</button>
				<button onClick={counter.fn.addToCountFn(-incrementAmount)}>{trV.counter.decrement}</button>
			</div>
		</>
	);
};
