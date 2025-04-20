import { useEffect, useRef } from "react";

/**
 * Immediately calls a function if bActive is true, then calls it at the given interval. Stops calling the function if bActive is false.
 * @param callback The function to call.
 * @param delay The delay in milliseconds.
 * @param bActive Whether the interval is active.
 */
export const useInterval = (callback: () => void, delay: number, bActive: boolean) => {
	const idRef = useRef<NodeJS.Timeout | undefined>(undefined);
	useEffect(() => {
		if (bActive) {
			if (idRef.current) return;
			callback();
			idRef.current = setInterval(callback, delay);
		} else {
			if (!idRef.current) return;
			clearInterval(idRef.current);
			idRef.current = undefined;
		}
		return () => clearInterval(idRef.current);
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [bActive]);
};
