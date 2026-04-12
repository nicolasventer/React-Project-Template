/* eslint-disable react-hooks/rules-of-hooks */
import type { DependencyList, Dispatch, SetStateAction } from "react";
import { useCallback, useDebugValue, useEffect, useSyncExternalStore } from "react";

type WatchObject = { [key: string]: ((prefix?: string) => void) | WatchObject };
type UnwatchObject = { [key: string]: (() => void) | UnwatchObject };

declare global {
	interface Window {
		store: {
			data: Record<string, unknown>;
			watch: WatchObject;
			unwatch: UnwatchObject;
		};
	}
}

window.store = {
	data: {},
	watch: {},
	unwatch: {},
};

/** Recursively assigns the properties of the source object to the target object. */
const setAtPath = (obj: object, pathStr: string, value: unknown) => {
	let cur = obj;
	const path = pathStr.split(".");
	for (let i = 0; i < path.length - 1; i++) {
		const key = path[i];
		if (!(key in cur)) (cur as Record<string, unknown>)[key] = {};
		cur = (cur as Record<string, unknown>)[key] as object;
	}
	(cur as Record<string, unknown>)[path[path.length - 1]] = value;
};

/** Recursively deletes the properties of the source object at the given path. */
const deleteAtPath = (obj: object, pathStr: string) => {
	const cur = [obj];
	const path = pathStr.split(".");
	for (let i = 0; i < path.length; i++) {
		const key = path[i];
		cur.push((cur[cur.length - 1] as Record<string, unknown>)[key] as object);
	}
	delete (cur[cur.length - 1] as Record<string, unknown>)[path[path.length - 1]];
	for (let i = cur.length - 2; i >= 0; i--) {
		if (Object.keys(cur[i]).length === 0) delete cur[i];
		else break;
	}
};

/** The type of a value that is not a function */
export type NotFunction<T> = T extends (...args: unknown[]) => unknown ? never : T;

/**
 * Private global state class. Can be created only using the `store` function.
 * @template T - The type of the global state.
 */
class Store_<T extends NotFunction<unknown>> {
	private onChange: (() => void)[] = [];
	/**
	 * Constructor for the global state.
	 * @param val - The initial value of the global state.
	 * @param debugLabel - The label to use for debugging.
	 */
	constructor(
		private val: T,
		/** @deprecated (set as deprecated to discourage access) */
		public readonly debugLabel?: string,
	) {
		if (this.debugLabel) {
			const debugLabel = this.debugLabel;
			this.onChange.push(() => setAtPath(window.store.data, debugLabel, this.val));
			setAtPath(window.store.data, debugLabel, this.val);
			const watchFn = (prefix?: string) => {
				const watch = prefix ? () => console.log(prefix, this.val) : () => console.log(this.val);
				this.onChange.push(watch);
				setAtPath(window.store.unwatch, debugLabel, () => {
					this.onChange = this.onChange.filter((v) => v !== watch);
					deleteAtPath(window.store.unwatch, debugLabel);
				});
			};
			setAtPath(window.store.watch, debugLabel, watchFn);
		}
	}

	/** Returns the current value of the global state. ({@link Store_.use} should be used instead) */
	public get value() {
		return this.val;
	}

	/**
	 * Sets the current value of the global state
	 * @param v - The new value of the global state.
	 * @param useTransition - Whether to use view transition.
	 */
	public setValue = (v: SetStateAction<T>, useTransition = false) => {
		const fn = () => {
			// @ts-expect-error cannot handle the case where T is a function
			this.val = typeof v === "function" ? v(this.val) : v;
			for (const onChange of this.onChange) onChange();
		};
		if (useTransition) document.startViewTransition(fn);
		else fn();
	};

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
	public subscribe = (onChange: (v: T) => void) => {
		onChange(this.val);
		const fn = () => onChange(this.val);
		this.onChange.push(fn);
		return () => void (this.onChange = this.onChange.filter((v) => v !== fn));
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
	 * @param useTransition - Whether to use view transition.
	 * @returns The current value of the global state and a function to set it.
	 */
	public useState = (debugLabel?: string, useTransition = false) => {
		const subscribe = (refresh: () => void) => {
			this.onChange.push(refresh);
			return () => void (this.onChange = this.onChange.filter((v) => v !== refresh));
		};
		const s = useSyncExternalStore(subscribe, () => this.val);
		useDebugValue(debugLabel ?? this.debugLabel);
		const newSetS: Dispatch<SetStateAction<T>> = useCallback(
			(newVal) => {
				const fn = () => {
					// @ts-expect-error cannot handle the case where T is a function
					this.val = typeof newVal === "function" ? newVal(this.val) : newVal;
					for (const onChange of this.onChange) onChange();
				};
				if (useTransition) document.startViewTransition(fn);
				else fn();
			},
			[useTransition],
		);
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
		const newSetS: Dispatch<SetStateAction<T>> = useCallback((newVal) => {
			// @ts-expect-error cannot handle the case where T is a function
			this.val = typeof newVal === "function" ? newVal(this.val) : newVal;
			for (const onChange of this.onChange) onChange();
		}, []);
		// eslint-disable-next-line react-hooks/exhaustive-deps
		useEffect(() => effect(newSetS), deps);
	};
}

/** The type of a store */
export type Store<T> = Store_<T>;

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
	return new Store_(val, debugLabel);
}

/**
 * The type of the state of the store.
 * @template T - The type of the store.
 * @returns The type of the state of the store.
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type TypeOfStore<T extends Store<any>> = T extends Store<infer U> ? U : never;

/**
 * Recursively get the type of the state of the store.
 * @template T - The type of the object that contains store.
 * @returns The type of the object with the type of the store inferred.
 */
export type RecursiveTypeOfStore<T> = T extends Store<infer U> ? U : { [K in keyof T]: RecursiveTypeOfStore<T[K]> };
