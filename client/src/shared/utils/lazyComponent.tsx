/* eslint-disable @typescript-eslint/no-explicit-any */
import type { FC } from "react";
import { useEffect, useState } from "react";

/** Extracts keys of an object whose values are functions */
type FCKeys<T extends Record<string, unknown>> = {
	[K in keyof T]: T[K] extends (args: any) => unknown ? K : never;
}[keyof T];

/** Narrows a type to a function, or never if it’s not a function */
type AsFn<T> = T extends (args: any) => unknown ? T : never;

/**
 * Lazily loads a React component from a dynamic import.
 *
 * @param importFn - Function returning a module via dynamic import
 * @param key - Key of the component to render from the imported module
 * @param Fallback - Component rendered until the target component is loaded
 * @returns A component that loads and renders the target component on mount
 */
export const lazyComponent =
	<T extends Record<string, unknown>, K extends FCKeys<T>>(importFn: () => Promise<T>, key: K, Fallback: FC = () => null) =>
	(...props: Parameters<AsFn<T[K]>>) => {
		const [Comp, setComp] = useState(() => Fallback);
		useEffect(() => void importFn().then((m) => setComp(() => m[key] as FC)));
		return <Comp {...(props[0] as any)} />;
	};
