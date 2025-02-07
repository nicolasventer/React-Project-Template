import { effect } from "@preact/signals";
import { useEffect, useState } from "react";

/**
 * Hook to force a re-render when the signal changes.
 * @param signal the signal to watch
 * @returns the current value of the signal
 */
export const useReact = <T>(signal: { readonly value: T }) => {
	const [signal_, setSignal] = useState(signal.value);
	// eslint-disable-next-line react-hooks/exhaustive-deps
	useEffect(() => effect(() => setSignal(signal.value)), []);
	return signal_;
};
