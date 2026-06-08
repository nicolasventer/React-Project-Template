import type { ChangeEvent, KeyboardEvent } from "react";

/**
 * Converts the input of a function from a string to an event.
 * @param fn the function to convert the input of
 * @returns the function that takes an event as input
 */
export const evStringFn =
	(fn: (value: string) => void) => (ev: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) =>
		fn(ev.currentTarget.value);

/**
 * Converts the input of a function from a boolean to an event.
 * @param fn the function to convert the input of
 * @returns the function that takes an event as input
 */
export const evBoolFn = (fn: (value: boolean) => void) => (ev: ChangeEvent<HTMLInputElement>) => fn(ev.currentTarget.checked);

/**
 * Returns the function that executes the given function when the enter key is pressed.
 * @param fn the function to execute
 * @returns the function that executes the given function when the enter key is pressed
 */
export const onEnterFn = (fn: () => void) => (ev: KeyboardEvent<HTMLInputElement>) => {
	if (ev.key === "Enter") fn();
};

/**
 * Returns the element with the given id.
 * @param id the id of the element to return
 * @returns the element with the given id
 */
export const byId = <T extends HTMLElement = HTMLInputElement>(id: string) => document.getElementById(id) as T;

/**
 * Reads a JSON value from localStorage.
 * @template T - The expected value type.
 * @param key - The localStorage key.
 * @param defaultValue - The value returned when the key is missing or invalid.
 * @returns The stored value, or `defaultValue` on miss or parse error.
 */
export const readLocalStorageValue = <T>(key: string, defaultValue: T): T => {
	try {
		const raw = localStorage.getItem(key);
		if (raw === null) return defaultValue;
		return JSON.parse(raw) as T;
	} catch {
		return defaultValue;
	}
};

/**
 * Writes a JSON-serializable value to localStorage.
 * @template T - The value type.
 * @param key - The localStorage key.
 * @param value - The value to store.
 */
export const writeLocalStorageValue = <T>(key: string, value: T) => {
	localStorage.setItem(key, JSON.stringify(value));
};
