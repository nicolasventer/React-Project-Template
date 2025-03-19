/** Typed version of the Omit utility. */
export type TypedOmit<Type, K extends keyof Type> = Omit<Type, K>;

/** Typed version of the Extract utility. */
export type TypedExtract<Type, K extends Type> = Extract<Type, K>;

/** Typed version of the Exclude utility. */
export type TypedExclude<Type, K extends Type> = Exclude<Type, K>;

/**
 * Debounces the given function, be sure to store the debounced function in a variable to keep the reference.
 * @example
 * const debouncedFn = debounceFn(() => console.log("Hello"), 1000);
 * debouncedFn(); // waits 1000ms then logs "Hello"
 * debouncedFn(); // restarts the 1000ms timer
 * @param fn The function to debounce.
 * @param ms The milliseconds to wait before calling the function.
 * @returns The debounced function.
 */
export const debounceFn = <T extends unknown[]>(fn: (...args: T) => void, ms: number) => {
	let timeout: Timer | undefined;
	return (...args: T) => {
		clearTimeout(timeout);
		timeout = setTimeout(() => fn(...args), ms);
	};
};

/**
 * Throttles the given function, be sure to store the throttled function in a variable to keep the reference. \
 * The function will be called at most once every `ms` milliseconds and will be called with the last arguments passed. \
 * You can also pass an `onCall` function that will be called with the result of the function. \
 * This `onCall` function will not be triggered by cancelled calls.
 * @example
 * const throttledFn = throttleFn((text: string) => console.log(text), 1000);
 * throttledFn("Hello"); // logs "Hello"
 * throttledFn("World"); // waits 1000ms then logs "World"
 * throttledFn("my friend"); // cancels the previous call and logs "my friend" after 1000ms
 * @template T The type of the arguments of the function.
 * @template U The return type of the function.
 * @param fn The function to throttle.
 * @param ms The milliseconds to wait before calling the function again.
 * @param onCall A function that will be called with the result of the function.
 * @returns The throttled function.
 */
export const throttleFn = <T extends unknown[], U>(fn: (...args: T) => U, ms: number, onCall?: (result: U) => void) => {
	let lastCalled = 0;
	let timeout: Timer | undefined;
	let lastValue: U;
	return (...args: T) => {
		const now = Date.now();
		if (now - lastCalled >= ms) {
			lastCalled = now;
			lastValue = fn(...args);
			onCall?.(lastValue);
			return lastValue;
		} else {
			clearTimeout(timeout);
			timeout = setTimeout(() => {
				lastCalled = Date.now();
				lastValue = fn(...args);
				onCall?.(lastValue);
			}, ms - (now - lastCalled));
			return lastValue;
		}
	};
};

/**
 * Promise version of the function {@link throttleFn}. \
 * Wraps the given function in a promise and throttles it.
 * @template T The type of the arguments of the function.
 * @template U The return type of the function.
 * @param fn The function to wrap.
 * @param ms The milliseconds to wait before calling the function again.
 * @returns The throttled function that returns a promise.
 */
export const promisedThrottleFn =
	<T extends unknown[], U>(fn: (...args: T) => U, ms: number) =>
	(...args: T) =>
		new Promise<U>((resolve) => throttleFn(fn, ms, resolve)(...args));

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
export const isObjectEmpty = (obj: Record<string, unknown>) => {
	for (const prop in obj) if (Object.hasOwn(obj, prop)) return false;
	return true;
};

/**
 * Tries to parse the given JSON string and casts it to the given type.
 * @template T the type to cast the parsed JSON object to
 * @param jsonString the JSON string to parse (no checks of the type, e.g. casted value can have a different type)
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

/**
 * Stringifies the given object.
 * @template T the type of the object
 * @param obj the object to stringify
 * @param replacer An array of strings and numbers that acts as an approved list for selecting the object properties that will be stringified.
 * @param space Adds indentation, white space, and line break characters to the return-value JSON text to make it easier to read.
 * @returns
 */
export const jsonStringify = <T>(obj: T, replacer?: (number | string)[] | null, space?: string | number) =>
	JSON.stringify(obj, replacer, space);
