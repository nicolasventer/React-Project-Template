import { useEffect, useState } from "react";

/**
 * Type that can contains only the properties that are different between two objects, or the indexes that are different between two arrays.
 * @template T The type of the object.
 * @returns The type that a diff can be applied to.
 */
export type DiffObj<T> = T extends (infer U)[]
	? Record<number, DiffObj<U>> & {
			/** The length of the array, could be used to delete elements from the array. */
			length?: number;
		}
	: T extends object
		? { [K in keyof T]?: DiffObj<T[K]> }
		: T;

export type BaseSelector<T> = {
	/** The current value of the selector */
	value: Readonly<T>;
	/** Function to memoize the value of the selector, a callback can be provided to be called when the value changes. */
	memo: (onChange?: (prev: T, current: T) => void) => (() => T) & { unregister: () => void };
	/** Function to set (with partial {@link DiffObj} merges) the value of the selector (can be called anywhere) */
	set: (value: DiffObj<T> | ((prev: T) => DiffObj<T>)) => void;
	/** Hook to get the current value of the selector (should be called inside a component) */
	use: () => T;
	/** Hook to get and set (with partial {@link DiffObj} merges) the current value of the selector (should be called inside a component) */
	useState: () => [T, (value: DiffObj<T> | ((prev: T) => DiffObj<T>)) => void];
};

export type Selector<T> = BaseSelector<T> & (T extends object ? { [K in keyof T]: Selector<T[K]> } : object);

/**
 * Merges one object or array deeply into another. \
 * Only the properties that are present in the second object or array will be merged into the first one. \
 * If the objects or arrays are different, it returns the second one, else it returns the first one.
 * @template T The type of the objects or arrays.
 * @param a The original object or array.
 * @param b The new object or array to merge.
 * @returns The merged result that represents `Object.assign(a, b)` in depth.
 */
const partialMerge = <T>(a: T, b: DiffObj<T>): T => {
	if (a === b) return a;
	if (typeof a !== typeof b) return b as T;
	if (typeof a !== "object" || typeof b !== "object" || a === null || b === null) return b as T;
	const newA = (Array.isArray(a) ? [...a] : { ...a }) as T;
	let bChanged = false;
	if (Array.isArray(newA) && Array.isArray(b) && newA.length !== b.length) {
		newA.length = b.length;
		bChanged = true;
	}
	for (const k_ in b) {
		const k = k_ as keyof T & keyof DiffObj<T>;
		if (k in a) {
			newA[k] = partialMerge(a[k], b[k] as DiffObj<(typeof newA)[typeof k]>);
			bChanged ||= newA[k] !== a[k];
		} else {
			newA[k] = b[k] as (typeof newA)[typeof k];
			bChanged = true;
		}
	}
	if (!bChanged) return a;
	return newA as T;
};

/**
 * Executes the given function and updates the cached result when the dependencies change.
 * @param onDepsChange Optional callback invoked when deps change, with the previous dependency tuple and the new one.
 * @example
 * const sumCache = createCachedFn();
 * let a = 0;
 * let b = 0;
 * const sum = (a: number, b: number) => {
 * 	console.log(a + b);
 * 	return a + b;
 * };
 * let res = sumCache(() => sum(a, b), [a, b]); // logs 0 and returns 0
 * res = sumCache(() => sum(a, b), [a, b]); // returns 0 (cached result)
 * a = 1;
 * res = sumCache(() => sum(a, b), [a, b]); // logs 1 and returns 1
 * @returns
 */
const createCachedFn = (onDepsChange?: (lastDeps: unknown[], deps: unknown[]) => void) => {
	let lastDeps: unknown[] = [];
	let lastResult: unknown;
	return <T>(fn: () => T, deps: unknown[]): T => {
		if (lastDeps.length === deps.length && lastDeps.every((dep, index) => dep === deps[index])) return lastResult as T;
		onDepsChange?.(lastDeps, deps);
		lastDeps = deps;
		return (lastResult = fn());
	};
};

type Accessor<T> = {
	diff: DiffObj<T>;
	path: string[];
};

/**
 * Walks `obj` along `path` (each segment is a property key on objects or index on arrays).
 * Stops and returns `null` or `undefined` if an intermediate value is nullish.
 * @param obj Root value to traverse (typically the selector root state).
 * @param path Keys from root to the nested field, in order.
 * @returns The value at `path`, or `undefined` if a segment is missing.
 */
const getAtPath = (obj: unknown, path: string[]): unknown => {
	let cur: unknown = obj;
	for (const key of path) {
		if (cur === null || cur === undefined) return cur;
		cur = (cur as Record<string | number, unknown>)[key];
	}
	return cur;
};

/**
 * Builds a dependency cache like {@link createCachedFn}, but wires `onChange` to the first dependency
 * (used as `[selectedValue]` in `memo`) so callers get `(prev, current)` for the selected slice instead
 * of raw dependency arrays.
 * @template T Type of the memoized slice (matches the selector field type).
 * @param onChange Optional; invoked when the cached dependency tuple changes, with previous and new first dep.
 */
const getSelectorCache = <T>(onChange?: (prev: T, current: T) => void) => {
	const onDepsChange = onChange
		? (lastDeps: unknown[], deps: unknown[]) => onChange((lastDeps[0] ?? deps[0]) as T, deps[0] as T)
		: undefined;
	const cache = createCachedFn(onDepsChange);
	return cache;
};

/**
 * Creates a reactive store you navigate like an object: each property is another {@link Selector} for that
 * subtree. At any path you can read `.value`, update with `.set` (partial {@link DiffObj} merges), subscribe
 * in React with `.use()` / `.useState()`, or be reactive with `.memo(onChange)`.
 *
 * @example
 * ```tsx
 * const app = selector({ user: { name: "Ada" }, count: 0 });
 *
 * const UserCard = () => {
 *   const name = app.user.name.use();
 *   const count = app.count.use();
 *   return (
 *     <>
 *       <p>{name}</p>
 *       <button type="button" onClick={() => app.user.set({ name: "Bob" })}>
 *         Rename
 *       </button>
 *       <button type="button" onClick={() => app.count.set(count + 1)}>
 *         Count: {count}
 *       </button>
 *     </>
 *   );
 * }
 * ```
 *
 * @template T Object shape of the store (must be an object type so properties can nest).
 * @param target Initial state object; this defines the keys available at the root (and nested shapes).
 * @param root For internal recursion when building nested selectors; omit when creating the root store.
 * @param parent For internal recursion; omit at the root.
 * @returns A {@link Selector} for `T`: nested selectors plus `value`, `set`, `use`, `useState`, and `memo`.
 */
export const selector = <T extends object>(
	target: T,
	root = { value: target, diff: {} as DiffObj<T>, refreshSet: new Set<() => void>() },
	parent: Accessor<T> | undefined = undefined,
): Selector<T> =>
	new Proxy({ $: target } as unknown as Selector<T>, {
		get: (_, field: string) => {
			// Own key on `target`: nested selector with extended path and diff subtree.
			if (target && typeof target === "object" && field in target) {
				const diff = Object.assign(parent?.diff ?? root.diff, { [field]: {} });
				const path = [...(parent?.path ?? []), field];
				return selector(target[field as keyof T] as object, root, { diff, path });
			}
			// Live subtree at this path; root returns the whole store.
			if (field === "value") return parent ? getAtPath(root.value, parent.path) : root.value;
			// memo(onChange): cache by current slice; refresh is registered on root for post-set updates.
			const memoFn: BaseSelector<T>["memo"] = parent
				? (onChange) => {
						const cache = getSelectorCache(onChange);
						const refresh = () => cache<T>(() => getAtPath(root.value, parent.path) as T, [getAtPath(root.value, parent.path)]);
						root.refreshSet.add(refresh);
						return Object.assign(refresh, { unregister: () => void root.refreshSet.delete(refresh) });
					}
				: (onChange) => {
						const cache = getSelectorCache(onChange);
						const refresh = () => cache(() => root.value, [root.value]);
						root.refreshSet.add(refresh);
						return Object.assign(refresh, { unregister: () => void root.refreshSet.delete(refresh) });
					};
			if (field === "memo") return memoFn;
			// set: merge partial diff at this path (or replace root), then notify memo subscribers.
			const setFn: BaseSelector<T>["set"] = parent
				? (value) => {
						if (typeof value === "function") return setFn(value(getAtPath(root.value, parent.path) as T));
						Object.assign(parent.diff, { [parent.path[parent.path.length - 1]]: value });
						root.value = partialMerge(root.value, root.diff);
						for (const refresh of root.refreshSet) refresh();
					}
				: (value) => {
						if (typeof value === "function") return setFn(value(root.value));
						root.value = partialMerge(root.value, value);
						for (const refresh of root.refreshSet) refresh();
					};
			if (field === "set") return setFn;
			// useState: local React state synced via memo when the slice changes from outside.
			const useStateFn: BaseSelector<T>["useState"] = parent
				? () => {
						const [value, setValue] = useState(() => getAtPath(root.value, parent.path) as T);
						useEffect(() => {
							const refresh = memoFn((_, current) => setValue(current));
							root.refreshSet.add(refresh);
							return refresh.unregister;
						}, []);
						return [value, setFn];
					}
				: () => {
						const [value, setValue] = useState(root.value);
						useEffect(() => {
							const refresh = memoFn((_, current) => setValue(current));
							root.refreshSet.add(refresh);
							return refresh.unregister;
						}, []);
						return [value, setFn];
					};
			if (field === "useState") return useStateFn;
			// use: read-only subscription (useState without exposing the setter tuple).
			const useFn: BaseSelector<T>["use"] = () => {
				const [value, _] = useStateFn();
				return value;
			};
			if (field === "use") return useFn;
			console.warn(`Field '${field}' not found in target`);
			return undefined;
		},
	});
