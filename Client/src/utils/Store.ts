/* eslint-disable react-hooks/rules-of-hooks */
import type { DependencyList, Dispatch, SetStateAction } from "react";
import { useCallback, useDebugValue, useEffect, useState } from "react";

/** The type of a value that is not a function */
export type NotFunction<T> = T extends (...args: unknown[]) => unknown ? never : T;

/**
 * Private global state class. Can be created only using the `store` function.
 * @template T - The type of the global state.
 */
class PrivateStore_<T extends NotFunction<unknown>> {
	private onChange: Dispatch<SetStateAction<T>>[];

	/**
	 * Constructor for the global state.
	 * @param val - The initial value of the global state.
	 * @param debugLabel - The label to use for debugging.
	 */
	constructor(private val: T, private debugLabel?: string) {
		// @ts-expect-error cannot handle the case where T is a function
		this.onChange = [(v) => void (this.val = typeof v === "function" ? v(this.val) : v)];
	}

	/**
	 * @deprecated (set as deprecated to discourage use) \
	 * Returns the private store.
	 */
	public get private() {
		return this;
	}

	/**
	 * @deprecated (set as deprecated to discourage use) \
	 * Returns the current value of the global state.
	 */
	public get value() {
		return this.val;
	}

	/**
	 * @deprecated (set as deprecated to discourage use) \
	 * Sets the current value of the global state.
	 */
	public set value(v: T) {
		this.setValue(v);
	}

	/**
	 * @deprecated (set as deprecated to discourage use) \
	 * Sets the current value of the global state.
	 */
	public setValue = (v: SetStateAction<T>) => this.onChange.forEach((onChange) => onChange(v));

	/**
	 * @deprecated (set as deprecated to discourage use) \
	 * Subscribes to the global state and immediately calls the function with the current value. \
	 * This is useful when the global state is used outside a React component.
	 * @example
	 * ```ts
	 * const globalA = store(0);
	 * let a = 5;
	 * globalA.subscribe((v) => a = v);
	 * console.log(a); // 0
	 * globalA.setValue(1);
	 * console.log(a); // 1
	 * ```
	 * @param onChange - The function to call when the global state changes.
	 * @returns A function to unsubscribe from the global state.
	 */
	public subscribe = (onChange: Dispatch<SetStateAction<T>>) => {
		onChange(this.val);
		this.onChange.push(onChange);
		return () => void (this.onChange = this.onChange.filter((v) => v !== onChange));
	};

	/**
	 * Returns the current value of the global state.
	 * @param debugLabel - The label to use for debugging.
	 * @returns The current value of the global state.
	 */
	public use = (debugLabel?: string) => this.useState(debugLabel)[0];

	/**
	 * Returns the current value of the global state and a function to set it.
	 * @param debugLabel - The label to use for debugging.
	 * @returns The current value of the global state and a function to set it.
	 */
	public useState = (debugLabel?: string) => {
		const [s, setS] = useState(this.val);
		useDebugValue(debugLabel ?? this.debugLabel);
		useEffect(() => {
			this.onChange.push(setS);
			return () => void (this.onChange = this.onChange.filter((v) => v !== setS));
		}, []);
		const newSetS: Dispatch<SetStateAction<T>> = useCallback((newVal) => this.onChange.forEach((v) => v(newVal)), []);
		return [s, newSetS] as const;
	};

	/**
	 * Calls `React.useEffect` where the effect function has access to the set function of the store. \
	 * It allows the synchronization with another state, useful when useState is not available.
	 * @example
	 * ```tsx
	 * const globalA = store(0);
	 * const Acomp = () => {
	 * 	const a = globalA.use();
	 * 	return <div>{a}</div>;
	 * };
	 * const ABcomp = () => {
	 * 	const a = globalA.use();
	 * 	const [aB, setAB] = useState(() => ({ a, b: 0 }));
	 * 	globalA.useEffect((setA) => setA(aB.a), [aB.a]); // globalA is updated when aB.a changes
	 * // ... do other stuff with aB
	 * 	return <Acomp />;
	 * };
	 * ```
	 * @param effect - The effect function.
	 * @param deps - The dependencies of the effect.
	 */
	public useEffect = (effect: (setVal: Dispatch<SetStateAction<T>>) => void, deps: DependencyList) => {
		const newSetS: Dispatch<SetStateAction<T>> = useCallback((newVal) => this.onChange.forEach((v) => v(newVal)), []);
		// eslint-disable-next-line react-hooks/exhaustive-deps
		useEffect(() => effect(newSetS), deps);
	};
}

/** The type of a private store */
export type PrivateStore<T> = PrivateStore_<T>;

/**
 * Global state class.
 * @template T - The type of the global state.
 * Prevent the use of the `useState` method, (i.e. the access to the set function of the store)
 */
export type Store<T extends NotFunction<unknown>> = Omit<PrivateStore_<T>, "useState" | "value" | "setValue" | "subscribe">;
/**
 * Creates a new global state with an undefined value.
 * @template T - The type of the global state.
 * @returns A new global state with an undefined value.
 */
export function store<T extends NotFunction<unknown>>(): Store<T | undefined>;
/**
 * Creates a new global state.
 * @template T - The type of the global state.
 * @param val - The initial value of the global state.
 * @param debugLabel - The label to use for debugging.
 * @returns A new global state.
 */
export function store<T extends NotFunction<unknown>>(val: T, debugLabel?: string): Store<T>;
export function store<T extends NotFunction<unknown>>(val?: T, debugLabel?: string) {
	return new PrivateStore_(val, debugLabel);
}

/**
 * The type of the state of the store.
 * @template T - The type of the store.
 * @returns The type of the state of the store.
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type TypeOfStore<T extends Store<any>> = T extends Store<infer U> ? U : never;
