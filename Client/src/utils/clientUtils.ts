/* eslint-disable @typescript-eslint/no-explicit-any */
// eslint-disable-next-line project-structure/independent-modules
import { uniqueSort } from "@/Shared/SharedUtils";
import type { ChangeEvent, KeyboardEvent } from "react";
import toast from "react-hot-toast";

/**
 * Creates a toast that says the given description is not implemented yet
 * @param description the description of the feature that is not implemented yet
 */
export const TodoFn = (description: string) => () => toast(`${description} is not implemented yet`, { icon: "⏳" });

/**
 * Function that returns the given value, should be temporary until the value is defined in a constant
 * @param value the value to return
 * @returns the given value
 */
export const Magic = <T>(value: T) => value;

/**
 * Creates a responsive size value that scales with viewport width, capped at a maximum pixel value.
 * @example
 * responsiveSize(5) // "min(5vw, 50px)"
 * responsiveSize(3, 20) // "min(3vw, 60px)"
 * @param size The size value (used for both vw units and pixel calculation).
 * @param scale Multiplier to calculate the maximum pixel value (size * scale).
 * @returns A CSS min() function string.
 */
export const responsiveSize = (size: number, scale = 10) => `min(${size}vw, ${size * scale}px)`;

/**
 * Class that generates unique keys for objects.
 * @example
 * const exampleGenerator = new KeyGenerator("key");
 * const a = exampleGenerator.withKey({ name: "John" }); // { name: "John", key: 0 }
 * const b = exampleGenerator.withKey(10); // { key: 1, data: 10 }
 * @template T The type of the key parameter.
 * @param key The key to use for the key.
 * @returns The key generator object.
 */
export class KeyGenerator<T extends string> {
	constructor(private key: T) {}
	private id = 0;
	/**
	 * Adds a key to the given object.
	 * @template U The type of the data.
	 * @param obj If the data is an object, it adds the key to the object. Otherwise, it returns an object with the key and the data.
	 * @returns The object with the key.
	 */
	withKey = <U>(
		obj: U
	): U extends object
		? U & { [K in T]: number }
		: { [K in T]: number } & {
				/** The data */
				data: U;
		  } => (typeof obj === "object" ? ({ ...obj, [this.key]: this.id++ } as any) : ({ [this.key]: this.id++, data: obj } as any));
}

/**
 * Save a blob as a file with a filename.
 * @param blob blob to save
 * @param filename filename of the file
 * @example
 * saveAs(new Blob(["Hello, world!"], { type: "text/plain" }), "hello.txt");
 * saveAs(new Blob([JSON.stringify({ hello: "world" })], { type: "application/json" }), "hello.json");
 */
export const saveAs = (blob: Blob, filename: string) => {
	const url = URL.createObjectURL(blob);
	const a = document.createElement("a");
	a.href = url;
	a.download = filename;
	a.click();
	URL.revokeObjectURL(url);
	a.remove();
};

/**
 * Sorts the arrays in the given object and removes duplicates.
 * @param object the object with arrays to sort
 * @returns the object with sorted arrays
 */
export const uniqueSortObj = <T extends string, U>(object: Record<T, U[]>) =>
	Object.fromEntries(Object.entries(object).map(([key, value]) => [key, uniqueSort(value as U[])])) as Record<T, U[]>;

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
