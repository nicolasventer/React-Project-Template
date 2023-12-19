import { type EffectCallback, useEffect } from "react";

/**
 * Hook to run a function on mount
 * @param fn function to run
 */
// eslint-disable-next-line react-hooks/exhaustive-deps
export const useMount = (fn: EffectCallback) => useEffect(fn, []);
