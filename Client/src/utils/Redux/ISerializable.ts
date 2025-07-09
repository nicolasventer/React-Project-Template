/* eslint-disable @typescript-eslint/no-explicit-any */
/** Interface for objects that can be serialized to and from strings. */
export interface ISerializable {
	/**
	 * Creates a new instance of the class from a string representation
	 * @param value The string to parse into a new instance
	 * @returns A new instance of the implementing class
	 */
	fromString: (value: string) => ThisType<this>;

	/**
	 * Converts the instance to its string representation
	 * @returns The string representation of this instance
	 */
	toString: () => string;

	/**
	 * Converts the instance to a JSON string representation
	 * @returns The JSON string representation of this instance
	 */
	toJSON: () => string;
}

/**
 * Checks if an object implements the `ISerializable` interface.
 * @param obj The object to check
 * @returns `true` if the object implements the `ISerializable` interface, `false` otherwise
 */
export const isSerializable = (obj: unknown): obj is ISerializable =>
	typeof obj === "object" &&
	obj !== null &&
	typeof (obj as ISerializable).fromString === "function" &&
	typeof (obj as ISerializable).toString === "function" &&
	typeof (obj as ISerializable).toJSON === "function";

/**
 * Checks if two objects are deeply equal.
 * @param a The first object to compare
 * @param b The second object to compare
 * @returns `true` if the objects are deeply equal, `false` otherwise
 */
export const deepEqual = (a: unknown, b: unknown): boolean => {
	if (a === b) return true;
	if (isSerializable(a) && isSerializable(b)) return a.toString() === b.toString();
	if (typeof a !== typeof b) return false;
	if (typeof a === "function" && typeof b === "function") return a.toString() === b.toString();
	if (typeof a !== "object" || typeof b !== "object" || a === null || b === null) return false;
	if (Array.isArray(a)) {
		if (!Array.isArray(b)) return false;
		return a.length === b.length && a.every((v, i) => deepEqual(v, b[i]));
	}
	return Object.keys(a).every((k) => deepEqual(a[k as keyof typeof a], b[k as keyof typeof b]));
};

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

/**
 * Merges one object or array deeply into another. \
 * Only the properties that are present in the second object or array will be merged into the first one. \
 * If the objects or arrays are different, it returns the second one, else it returns the first one.
 * @template T The type of the objects or arrays.
 * @param a The original object or array.
 * @param b The new object or array to merge.
 * @returns The merged result that represents `Object.assign(a, b)` in depth.
 */
export const partialMerge = <T>(a: T, b: DiffObj<T>): T => {
	if (a === b) return a;
	if (isSerializable(a)) {
		if (isSerializable(b)) return a.toString() !== b.toString() ? (b as T) : a;
		if (typeof b === "string") return a.fromString(b) as T;
		throw new Error(`cleverMerge: b should be serializable or a string but is ${JSON.stringify(b)}`);
	}
	if (isSerializable(b)) return b as T;
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

const tryParseInt = (s: string) => {
	const n = parseInt(s);
	return isNaN(n) ? s : n;
};

class ProxyManager {
	private proxyMap = new WeakMap<object, object>(); // key: proxy, value: target

	createProxy = <T extends object>(target: T, handler: ProxyHandler<T>) => {
		const proxy = new Proxy<T>(target, handler);
		this.proxyMap.set(proxy, target);
		return proxy;
	};

	getTarget = (proxy: object) => this.proxyMap.get(proxy);
}

const { createProxy, getTarget } = new ProxyManager();

const BuildProxy = <T extends object>(target: T, diffObj: DiffObj<T>): T =>
	typeof target === "object" && target !== null
		? createProxy(target, {
				get: (_, field: string) => {
					const value = (target as any)[field];
					return BuildProxy(value, typeof value === "object" ? ((diffObj as any)[field] = (diffObj as any)[field] ?? {}) : value);
				},
				set: (_, field: string, newValue) => {
					(diffObj as any)[Array.isArray(target) ? tryParseInt(field) : field] = newValue;
					return true;
				},
		  })
		: target;

const cleanupDiffObj = <T extends object>(target: T, diffObj: DiffObj<T>): DiffObj<T> => {
	for (const k in diffObj) {
		const v = diffObj[k];
		if (v && typeof v === "object" && v instanceof Map === false) {
			const value = target ? (target as any)[k] : undefined;
			const proxyTarget = getTarget(v);
			if (proxyTarget) diffObj[k] = proxyTarget as DiffObj<T>[typeof k];
			else if (!Array.isArray(v) && Object.keys(v).length === 0) delete diffObj[k];
			else cleanupDiffObj(value, v);
		}
	}
	return diffObj;
};

/**
 * Clones an object and updates it with a function.
 * @template T The type of the object.
 * @param obj The object to clone.
 * @param update The function to update the object.
 * @returns The cloned object with the updated values.
 */
export const cloneWithUpdate = <T extends object>(obj: T, update: (obj: T) => void): T => {
	const diffObj = {} as DiffObj<T>;
	const proxyObj = BuildProxy(obj, diffObj);
	update(proxyObj);
	const cleanedDiffObj = cleanupDiffObj(obj, diffObj);
	return partialMerge(obj, cleanedDiffObj);
};

/**
 * Merges two objects or arrays deeply by trying to keep the original object or array if possible. \
 * If the objects or arrays are different, it returns the second one, else it returns the first one.
 * @template T The type of the objects or arrays.
 * @param a The original object or array.
 * @param b The new object or array to merge.
 * @returns The merged result that represents `a !== b ? b : a` in depth.
 */
export const cleverMerge = <T>(a: T, b: T): T => {
	if (isSerializable(a)) {
		if (isSerializable(b)) return a.toString() !== b.toString() ? b : a;
		if (typeof b === "string") return a.fromString(b) as T;
		throw new Error(`cleverMerge: b should be serializable or a string but is ${JSON.stringify(b)}`);
	}
	if (isSerializable(b)) return b;
	if (typeof a !== typeof b) return b;
	if (typeof a !== "object" || typeof b !== "object" || a === null || b === null) return a !== b ? b : a;
	if (Array.isArray(a)) {
		if (!Array.isArray(b)) return b;
		const newA = [...a] as T & unknown[];
		let bChanged = false;
		newA.length = b.length;
		b.forEach((v, i) => {
			newA[i] = cleverMerge(a[i], v);
			bChanged ||= newA[i] !== a[i];
		});
		return bChanged ? newA : a;
	}
	const newA = { ...a };
	let bChanged = false;
	for (const k in a) {
		if (k in b) newA[k] = cleverMerge(a[k], b[k]);
		else delete newA[k];
		bChanged ||= newA[k] !== a[k];
	}
	for (const k in b)
		if (!(k in a)) {
			newA[k] = b[k];
			bChanged = true;
		}
	return bChanged ? newA : a;
};
