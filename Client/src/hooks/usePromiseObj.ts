import { useCallback, useEffect, useState } from "react";

/**
 * Hook to run a promise and get the state of it
 * @param fn function to run
 * @param runArgs arguments to run the function with on mount, if provided, do not forget to catch the promise
 * @returns object with the state of the promise, a run function to run the promise and a setData function to set the data
 */
export const usePromiseObj = <T, U extends unknown[], V = unknown>(fn: (...args: U) => Promise<T>, runArgs?: U) => {
	const [state, setState] = useState({
		/** Whether the promise is loading */
		loading: false,
		/** The error of the promise */
		error: null as V | null,
		/** The data of the promise */
		data: null as T | null,
	});

	const setData = useCallback((data: T) => setState({ loading: false, error: null, data }), []);

	const run = useCallback(
		async (...args: U) => {
			setState({ ...state, loading: true });
			try {
				const data = await fn(...args);
				setState({ loading: false, error: null, data });
				return data;
			} catch (error) {
				setState({ loading: false, error: error as V, data: null });
				throw error;
			}
		},
		[fn, state]
	);

	// eslint-disable-next-line react-hooks/exhaustive-deps
	useEffect(() => void (runArgs && run(...runArgs)), []);

	return {
		...state,
		/** Function to run the promise */
		run,
		/** Function to set the data */
		setData,
	};
};
