import { TimerLifeCycle } from "@/features/timer/components/TimerLifeCycle";
import { tr } from "@/features/timer/logic/tr";
import { useEffect, useState } from "react";
import styles from "./Timer.module.css";

export const Timer = () => {
	const urlSearchParams = new URLSearchParams(window.location.search);
	const interval = Number(urlSearchParams.get("interval") ?? 1000);

	const [time, setTime] = useState(0);
	const trV = tr.use();

	useEffect(() => {
		const initialTime = Date.now();
		const updateTime = () => {
			const elapsed = Date.now() - initialTime;
			setTime(Math.floor(elapsed / interval) * interval);
			timeoutId = setTimeout(updateTime, interval - (elapsed % interval));
		};
		let timeoutId = setTimeout(updateTime, interval);
		return () => clearTimeout(timeoutId);
	}, [interval]);

	return (
		<>
			<TimerLifeCycle />
			<div className={styles.root}>
				<div className={styles.card}>
					<p className={styles.label}>{trV.timer.label}</p>
					<p className={styles.value}>
						{time}
						<span className={styles.unit}>{trV.timer.unit}</span>
					</p>
				</div>
			</div>
		</>
	);
};
