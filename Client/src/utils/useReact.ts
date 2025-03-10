import { effect } from "@preact/signals";
import { useEffect, useState } from "react";

/**
 * Hook to force a re-render when the signal changes.
 * @example
 * ```tsx
 * const count = signal(0);
 * const Comp = () => <div>{useReact(count)}</div>; // re-render when count changes
 * const Comp2 = () => <div>{void useReact(count)}</div>; // re-render when count changes but will not display the value
 * ```
 * @param signal the signal to watch
 * @returns the current value of the signal
 */
export const useReact = <T>(signal: { readonly value: T }) => {
	const [signal_, setSignal] = useState(signal.value);
	// eslint-disable-next-line react-hooks/exhaustive-deps
	useEffect(() => effect(() => setSignal(signal.value)), []);
	return signal_;
};
