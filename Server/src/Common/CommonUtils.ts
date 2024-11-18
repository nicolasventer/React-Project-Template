/* eslint-disable no-mixed-spaces-and-tabs */

/** The type of an object with the keys as the values of the enum. */
export type EnumObj<T extends Readonly<string>> = { [K in T]: K };

/**
 * Ensure that the object is an EnumObj.
 * @template T The type of the enum.
 * @param _ The object to check.
 * @returns nothing.
 */
export const checkEnumObj = <T extends Readonly<string>>(_: EnumObj<T>) => void 0;

/**
 * Debounces the given function, be sure to store the debounced function in a variable to keep the reference.*
 * @example
 * const debouncedFn = debounceFn(() => console.log("Hello"), 1000);
 * debouncedFn(); // waits 1000ms then logs "Hello"
 * debouncedFn(); // restarts the 1000ms timer
 * @param fn The function to debounce.
 * @param ms The milliseconds to wait before calling the function.
 * @returns The debounced function.
 */
export const debounceFn = (fn: Function, ms: number) => {
	// eslint-disable-next-line no-undef
	let timeout: Timer;
	return <T extends any[]>(...args: T) => {
		clearTimeout(timeout);
		timeout = setTimeout(() => fn(...args), ms);
	};
};

/**
 * Waits for the given amount of milliseconds.
 * @param ms the amount of milliseconds to wait
 * @returns a promise that resolves after the given amount of milliseconds
 */
export const wait = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

/**
 * Checks if the given object is empty.
 * @param obj the object to check
 * @returns true if the object is empty, false otherwise
 */
export const isObjectEmpty = (obj: Record<string, any>) => {
	for (const prop in obj) if (Object.hasOwn(obj, prop)) return false;
	return true;
};

/**
 * Tries to parse the given JSON string.
 * @param jsonString the JSON string to parse
 * @param defaultValue the default value to return if the JSON string is invalid
 * @returns the parsed JSON object or the default value if the JSON string is invalid
 */
export const tryParseJson = <T>(jsonString: string, defaultValue: T) => {
	try {
		return JSON.parse(jsonString) as T;
	} catch {
		return defaultValue;
	}
};
