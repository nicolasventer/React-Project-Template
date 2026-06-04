import { useEffect, useState } from "react";

export const Timer = () => {
	const urlSearchParams = new URLSearchParams(window.location.search);
	const interval = Number(urlSearchParams.get("interval") ?? 1000);

	const [time, setTime] = useState(0);

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

	return <div>Timer: {time}ms</div>;
};
