import { useState } from "react";

export const Counter = () => {
	const urlSearchParams = new URLSearchParams(window.location.search);
	const start = Number(urlSearchParams.get("start") ?? 0);
	const increment = Number(urlSearchParams.get("increment") ?? 1);
	const [count, setCount] = useState(start);

	return (
		<div>
			Counter: {count}
			<button onClick={() => setCount(count + increment)}>Increment</button>
			<button onClick={() => setCount(count - increment)}>Decrement</button>
		</div>
	);
};
