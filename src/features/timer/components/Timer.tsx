import { TimerLifeCycle } from "@/features/timer/components/TimerLifeCycle";
import { tr } from "@/features/timer/logic/tr";
import { useEffect, useState } from "react";

export const Timer = () => {
	const urlSearchParams = new URLSearchParams(window.location.search);
	const interval = Number(urlSearchParams.get("interval") ?? 1000);

	const [time, setTime] = useState(0);
	const trV = tr.use();

	useEffect(() => {
		const initialTime = Date.now();
		const updateTime = () => {
			const newTime = Date.now() - initialTime;
			setTime(newTime);
			timeoutId = setTimeout(updateTime, interval - (newTime % interval));
		};
		let timeoutId = setTimeout(updateTime, interval);
		return () => clearTimeout(timeoutId);
	}, [interval]);

	return (
		<>
			<TimerLifeCycle />
			<div>
				{trV.timer.label}: {time}
				{trV.timer.unit}
			</div>
		</>
	);
};
