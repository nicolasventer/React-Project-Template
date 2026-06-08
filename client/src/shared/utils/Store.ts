/* eslint-disable react-hooks/rules-of-hooks */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { getLocalStorageKey } from "@/shared/Config";
import type { Dispatch, SetStateAction } from "react";
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

if (typeof window !== "undefined")
	window.store = {
		data: {},
		watch: {},
		unwatch: {},
	};

/** Recursively assigns the properties of the source object to the target object. */
const setAtPath = (obj: object, path: string[], value: unknown) => {
	let cur = obj;
	for (let i = 0; i < path.length - 1; i++) {
		const key = path[i];
		if (!(key in cur)) (cur as Record<string, unknown>)[key] = {};
		cur = (cur as Record<string, unknown>)[key] as object;
	}
	(cur as Record<string, unknown>)[path[path.length - 1]] = value;
};

/** Recursively assigns the properties of the source object to the target object. */
const setAtStrPath = (obj: object, pathStr: string, value: unknown) => {
	setAtPath(obj, pathStr.split("."), value);
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

/**
 * Recursively get the type of the state of the store.
 * @template T - The type of the object that contains store.
 * @returns The type of the object with the type of the store inferred.
 */
export type RecursiveTypeOfStore<T> =
	T extends Store<infer U>
		? RecursiveTypeOfStore<U>
		: T extends Array<infer U>
			? Array<RecursiveTypeOfStore<U>>
			: T extends object
				? { [K in keyof T]: RecursiveTypeOfStore<T[K]> }
				: T;

/** The type of a value that is not a function */
export type NotFunction<T> = T extends (...args: unknown[]) => unknown ? never : T;

/**
 * Private global state class. Can be created only using the `store` function.
 * @template T - The type of the global state.
 */
class Store_<T extends NotFunction<unknown>> {
	private onChange: (() => void)[] = [];
	private onRecursiveChange: (() => void)[] = [];
	private childStoreSet = new WeakSet<Store_<unknown>>();

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
			this.onChange.push(() => setAtStrPath(window.store.data, debugLabel, this.val));
			setAtStrPath(window.store.data, debugLabel, this.val);
			const watchFn = (prefix?: string) => {
				const watch = prefix ? () => console.log(prefix, this.val) : () => console.log(this.val);
				this.onChange.push(watch);
				setAtStrPath(window.store.unwatch, debugLabel, () => {
					this.onChange = this.onChange.filter((v) => v !== watch);
					deleteAtPath(window.store.unwatch, debugLabel);
				});
			};
			setAtStrPath(window.store.watch, debugLabel, watchFn);
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
			if (this.onRecursiveChange.length > 0) this.recursiveAddChildStore(this.val);
			for (const onChange of this.onChange) onChange();
			for (const onRecursiveChange of this.onRecursiveChange) onRecursiveChange();
		};
		if (useTransition) document.startViewTransition(fn);
		else fn();
	};

	private recursiveAddChildStore = (v: unknown) => {
		if (v instanceof Store_) {
			if (!this.childStoreSet.has(v)) {
				this.childStoreSet.add(v);
				v.subscribe(
					() => {
						for (const onRecursiveChange of this.onRecursiveChange) onRecursiveChange();
					},
					false,
					false,
				);
			}
			this.recursiveAddChildStore(v.val);
		} else if (Array.isArray(v)) {
			for (const item of v) this.recursiveAddChildStore(item);
		} else if (typeof v === "object" && v !== null) {
			for (const value of Object.values(v)) this.recursiveAddChildStore(value);
		}
	};

	/**
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
	 * @param bImmediateCall - Whether to call the function immediately with the current value.
	 * @param bRecursive - Whether to subscribe to the child stores recursively.
	 * @returns A function to unsubscribe from the global state.
	 */
	public subscribe = (onChange: (v: T) => void, bImmediateCall = true, bRecursive = false) => {
		if (bImmediateCall) onChange(this.val);
		const fn = () => onChange(this.val);
		this.onChange.push(fn);
		if (bRecursive) {
			if (this.onRecursiveChange.length === 0) this.recursiveAddChildStore(this.val);
			this.onRecursiveChange.push(fn);
		}
		return () => {
			this.onChange = this.onChange.filter((v) => v !== fn);
			if (bRecursive) this.onRecursiveChange = this.onRecursiveChange.filter((v) => v !== fn);
		};
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

	public toJSON() {
		return { $Store: this.val };
	}
}

/** The type of a store */
export type Store<T> = Store_<T>;

/** The type of a base store (common to store and read-only store) */
export type BaseStore<T> = Omit<Store_<T>, "setValue" | "useState">;

/** The type of a read-only store */
export type ReadOnlyStore<T> = BaseStore<T> & { unsubscribe: () => void };

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

const readLocalStorageValue = <T>(key: string, defaultValue: T): T => {
	if (typeof window === "undefined") return defaultValue;
	try {
		const raw = localStorage.getItem(getLocalStorageKey(key));
		if (raw === null) return defaultValue;
		return JSON.parse(raw) as T;
	} catch {
		return defaultValue;
	}
};

const writeLocalStorageValue = <T>(key: string, value: T) => {
	if (typeof window === "undefined") return;
	localStorage.setItem(getLocalStorageKey(key), JSON.stringify(value));
};

/**
 * Creates a store backed by localStorage.
 * @template T - The store value type.
 * @param key - The localStorage key suffix (prefixed via {@link getLocalStorageKey}).
 * @param defaultValue - The value used when nothing is stored yet.
 * @returns A store that reads from localStorage and persists on update.
 */
export const localStorageStore = <T extends NotFunction<unknown>>(key: string, defaultValue: T): Store<T> => {
	const s = store(readLocalStorageValue(key, defaultValue));
	s.subscribe((v) => writeLocalStorageValue(key, v), false);
	return s;
};

type InferArgs<T extends readonly BaseStore<unknown>[]> = T extends readonly [BaseStore<infer U>, ...infer V]
	? [U, ...InferArgs<V extends readonly BaseStore<any>[] ? V : never>]
	: [];

type NoFirst<T extends readonly unknown[]> = T extends readonly [unknown, ...infer V] ? V : T;

/**
 * Creates a derived read-only store from other stores.
 * **Warning: This function is not intended to be used inside React components, use {@link useComputedStore} instead.**
 * @template T - The dependency store tuple type.
 * @template U - The computed value type.
 * @param deps - The stores whose current values are passed to `fn`.
 * @param fn - Computes the derived value from the dependency values.
 * @returns A read-only store that recomputes when any dependency changes and exposes `unsubscribe`.
 */
export const computedStore = <const T extends readonly BaseStore<unknown>[], U>(deps: T, fn: (...args: InferArgs<T>) => U) => {
	const refresh = () => {
		const args = deps.map((dep) => dep.value) as InferArgs<T>;
		return fn(...args);
	};
	const { setValue, useState: _, ...result } = store(refresh());
	const unsubscribeList = deps.map((dep) => dep.subscribe(() => setValue(refresh())));
	const unsubscribe = () => unsubscribeList.forEach((unsubscribe) => unsubscribe());
	return Object.assign(result, { unsubscribe }) as ReadOnlyStore<U>;
};

/**
 * Subscribes an effect to one or more stores.
 * Runs the effect whenever any dependency changes and calls the previous cleanup before re-running.
 * @template T - The dependency store tuple type.
 * @template U - The effect return type (can optionally be a cleanup function).
 * @param deps - The stores whose current values are passed to `fn`.
 * @param fn - Runs side effects from the dependency values and can return a cleanup function.
 * @returns A function that runs the latest cleanup and unsubscribes all dependency listeners.
 */
export const effectStore = <const T extends readonly BaseStore<unknown>[], U>(deps: T, fn: (...args: InferArgs<T>) => U) => {
	let cleanUp = () => {};
	const refresh = () => {
		const args = deps.map((dep) => dep.value) as InferArgs<T>;
		const c = fn(...args);
		cleanUp = typeof c === "function" ? (c as () => void) : () => {};
	};
	const unsubscribeList = deps.map((dep) =>
		dep.subscribe(() => {
			cleanUp();
			refresh();
		}),
	);
	return () => {
		cleanUp();
		unsubscribeList.forEach((unsubscribe) => unsubscribe());
	};
};

/**
 * Creates a derived read-only store for use inside React components.
 * *(Same as {@link computedStore} but automatically cleans up subscriptions on unmount)*
 * @template T - The dependency store tuple type.
 * @template U - The computed value type.
 * @param deps - The stores whose current values are passed to `fn`.
 * @param fn - Computes the derived value from the dependency values.
 * @returns A read-only store whose subscriptions are cleaned up automatically on unmount.
 */
export const useComputedStore = <const T extends readonly BaseStore<unknown>[], U>(deps: T, fn: (...args: InferArgs<T>) => U) => {
	const { unsubscribe, ...result } = computedStore(deps, fn);
	useEffect(() => unsubscribe, [unsubscribe]);
	return result as ReadOnlyStore<U>;
};

/**
 * Wraps a read-only store with write helpers.
 * @template T - The store value type.
 * @param store - The read-only store to extend.
 * @param setValue - Updates the store value and optionally uses a transition.
 * @returns A writable store view with `setValue`, `useState`, and `unsubscribe`.
 */
export const toRWStore = <T>(store: ReadOnlyStore<T>, setValue: (v: SetStateAction<T>, useTransition?: boolean) => void) => {
	const useState = (debugLabel?: string, useTransition = false) => {
		const s = store.use(debugLabel);
		return [s, (v: SetStateAction<T>) => setValue(v, useTransition)] as const;
	};
	const result = { ...store, setValue, useState };
	return result as Store<T> & { unsubscribe: () => void };
};

/**
 * Wraps a read-only store with write helpers for use inside React components.
 * *(Same as {@link toRWStore} but automatically cleans up subscriptions on unmount)*
 * @template T - The store value type.
 * @param store - The read-only store to extend.
 * @param setValue - Updates the store value and optionally uses a transition.
 * @returns A writable store view whose subscriptions are cleaned up automatically on unmount.
 */
export const useRWStore = <T>(store: ReadOnlyStore<T>, setValue: (v: SetStateAction<T>, useTransition?: boolean) => void) => {
	const { unsubscribe, ...result } = toRWStore(store, setValue);
	useEffect(() => unsubscribe, [unsubscribe]);
	return result as Store<T>;
};

/**
 * The type of the state of the store.
 * @template T - The type of the store.
 * @returns The type of the state of the store.
 */
export type TypeOfStore<T extends Store<any>> = T extends Store<infer U> ? U : never;

/**
 * Serializes a store by converting it to a plain value and encoding it as JSON.
 * @template T - The store type to serialize.
 * @param val - The store to serialize.
 * @param args - Additional arguments to pass to `JSON.stringify`.
 * @returns A JSON string representation of the store value.
 */
export const serializeStore = <T>(val: T, ...args: NoFirst<Parameters<typeof JSON.stringify>>) => JSON.stringify(val, ...args);

const deserializeStoreAux = <T>(obj: unknown): T => {
	if (typeof obj !== "object" || !obj) return obj as T;
	if (Array.isArray(obj)) return obj.map(deserializeStoreAux) as T;
	if ("$Store" in obj) return store(deserializeStoreAux(obj.$Store)) as T;
	return Object.fromEntries(Object.entries(obj).map(([key, value]) => [key, deserializeStoreAux(value)])) as T;
};

/**
 * Recursively restores serialized `Store` instances from plain objects and arrays.
 * @template T - The deserialized value type.
 * @param obj - The serialized value to deserialize.
 * @returns The deserialized value with nested stores restored.
 */
export const deserializeStore = <T>(str: string): T => deserializeStoreAux(JSON.parse(str));

/**
 * Recursively converts a value to a plain value.
 * **Warning: This function should not be used to serialize a store, use {@link serializeStore} instead.**
 * @template T - The value type to convert.
 * @param val - The value to convert.
 * @returns A plain value.
 */
export const toPlainVal = <T>(val: T): RecursiveTypeOfStore<T> => {
	if (Array.isArray(val)) return val.map(toPlainVal) as RecursiveTypeOfStore<T>;
	if (typeof val !== "object" || !val) return val as RecursiveTypeOfStore<T>;
	if (val instanceof Store_) return toPlainVal(val.value) as RecursiveTypeOfStore<T>;
	return Object.fromEntries(Object.entries(val).map(([key, value]) => [key, toPlainVal(value)])) as RecursiveTypeOfStore<T>;
};
