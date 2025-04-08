import { useEffect, useState } from "react";

/**
 * Hook to delay the display of a slow component.
 * @example
 * ```tsx
 * const Comp = () => {
 * 	const loading = useLoading();
 * 	return <div>{loading ? "Loading..." : <SlowComponent />}</div>;
 * };
 * ```
 * @param delayMs - The delay in milliseconds before the loading state is set to false.
 * @returns A boolean value indicating whether the component is loading.
 */
export const useLoading = (delayMs = 200) => {
	const [loading, setLoading] = useState(true);

	useEffect(() => void setTimeout(() => setLoading(false), delayMs), [delayMs]);

	return loading;
};
