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
