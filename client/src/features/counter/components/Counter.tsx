import { config } from "@/bootstrap/config";
import { CounterLifeCycle } from "@/features/counter/components/CounterLifeCycle";
import { counter } from "@/features/counter/logic/counter";
import { tr } from "@/features/counter/logic/tr";
import styles from "./Counter.module.css";

export const Counter = ({ start }: { start?: string }) => {
	counter.fn.initState({ count: Number(start ?? 0) });
	const incrementAmount = config.features.counter.specific?.increment ?? 1;
	const count = counter.count.use();
	const trV = tr.use();

	return (
		<>
			<CounterLifeCycle />
			<div className={styles.root}>
				<div className={styles.card}>
					<p className={styles.label}>{trV.counter.label}</p>
					<p className={styles.value}>{count}</p>
					<div className={styles.actions}>
						<button type="button" className={styles.button} onClick={counter.fn.addToCountFn(-incrementAmount)}>
							-{incrementAmount}
						</button>
						<button type="button" className={styles.button} onClick={counter.fn.addToCountFn(incrementAmount)}>
							+{incrementAmount}
						</button>
					</div>
				</div>
			</div>
		</>
	);
};
