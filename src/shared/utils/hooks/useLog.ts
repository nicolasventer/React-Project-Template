import type { DependencyList } from "react";
import { useEffect } from "react";

/**
 * Hook to log a value to the console.
 * @param value - The value to log.
 * @param prefix - The prefix to log.
 * @param deps - The dependencies of the effect. (default: [value])
 */
export const useLog = (value: unknown, prefix?: string, deps?: DependencyList) =>
	// eslint-disable-next-line react-hooks/exhaustive-deps
	useEffect(() => (prefix ? console.log(prefix, value) : console.log(value)), deps ?? [value]);
