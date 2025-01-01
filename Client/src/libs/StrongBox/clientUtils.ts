/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-wrapper-object-types */
import { tr } from "@/gs";
import type { ChangeEvent } from "react";
import toast from "react-hot-toast";

/**
 * Creates a toast that says the given description is not implemented yet
 * @param description the description of the feature that is not implemented yet
 */
export const TodoFn = (description: string) => () => toast(`${description} ${tr.v["is not implemented yet"]}`, { icon: "⏳" });

/**
 * Function that returns the given value, should be temporary until the value is defined in a constant
 * @param value the value to return
 * @returns the given value
 */
export const Magic = <T>(value: T) => value;

/**
 * Calculates the width size object based on the given size.
 * The width size object is a string that represents the minimum value between the given size in viewport width (vw) and the given size multiplied by 10 pixels.
 *
 * @template T - The type of the size parameter.
 * @param {T} size - The size value to calculate the width size object.
 * @param {number} [scale=10] - The scale value to multiply the size value by to get the pixel value.
 * @returns The width size object as a string.
 */
export const widthSizeObj = <T extends number>(size: T, scale = 10) => `min(${size}vw, ${size * scale}px)` as const;

/**
 * Class that generates unique ids for objects.
 * @example
 * const exampleGenerator = new IdGenerator("key");
 * const a = exampleGenerator.withId({ name: "John" }); // { name: "John", key: 0 }
 * const b = exampleGenerator.withId(10); // { key: 1, data: 10 }
 * @template T - The type of the key parameter.
 * @param {T} key - The key to use for the id.
 * @returns The id generator object.
 */
export class IdGenerator<T extends string> {
	constructor(private key: T) {}
	private id = 0;
	/**
	 * Adds an id to the given object.
	 * @template U - The type of the data.
	 * @param {U} obj - If the data is an object, it adds the id to the object. Otherwise, it returns an object with the id and the data.
	 * @returns The object with the id.
	 */
	withId = <U>(
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
 * Returns a string that represents the difference between two objects.
 * The format of the string is: 'path: value1 --> value2'. For undefined values, '___' is used.
 * @param obj1 first object
 * @param obj2 second object
 * @returns the difference between the two objects as a string
 */
export const objDiffStr = (obj1: Object, obj2: Object): string => {
	const keys = new Set([...Object.keys(obj1 ?? {}), ...Object.keys(obj2 ?? {})]) as Set<keyof typeof obj1 | keyof typeof obj2>;
	const result = [];
	for (const k of keys) {
		if (typeof obj1[k] === "object") {
			if (typeof obj2[k] === "object") {
				const diffStr = objDiffStr(obj1[k], obj2[k]);
				if (diffStr) diffStr.split("\n").forEach((line) => result.push(`${k}.${line}`));
			} else {
				const diffStr = objDiffStr(obj1[k], {});
				if (diffStr) diffStr.split("\n").forEach((line) => result.push(`${k}.${line}`));
				else result.push(`${k}: ${obj1[k] ?? "___"} --> ${obj2[k]}`);
			}
		} else if (typeof obj2[k] === "object") {
			const diffStr = objDiffStr({}, obj2[k]);
			if (diffStr) diffStr.split("\n").forEach((line) => result.push(`${k}.${line}`));
			else result.push(`${k}: ${obj1[k]} --> ${obj2[k] ?? "___"}`);
		} else if (obj1[k] !== obj2[k]) {
			result.push(`${k}: ${obj1[k] ?? "___"} --> ${obj2[k]}`);
		}
	}
	return result.join("\n");
};

/**
 * Returns an object that represents the difference between two objects.
 * @param currentValue reference object
 * @param defaultValue default object
 * @returns the difference between the two objects
 */
export const objDiffObj = (currentValue: Object, defaultValue: Object): Object => {
	const result: any = {};
	for (const [k, kCurrentValue] of Object.entries(currentValue ?? {})) {
		const kDefaultValue = defaultValue[k as keyof typeof defaultValue];
		if (typeof kCurrentValue === "object") {
			if (typeof kDefaultValue === "object") {
				const diffObj = objDiffObj(kCurrentValue, kDefaultValue);
				if (Object.keys(diffObj).length) result[k] = diffObj;
			} else if (Object.keys(kCurrentValue).length) result[k] = { ...kCurrentValue };
		} else if (typeof kDefaultValue === "object") result[k] = kCurrentValue;
		else if (kCurrentValue !== kDefaultValue) result[k] = kCurrentValue;
	}
	return result;
};

/**
 * Converts an object to URL parameters (key-value pairs).
 * @param obj the object to convert
 * @returns the URL parameters as key-value pairs
 */
export const objToUrlParams = (obj: Object): Record<string, string> => {
	const result: Record<string, string> = {};
	for (const [k, v] of Object.entries(obj)) {
		if (typeof v === "object") {
			const nestedParams = objToUrlParams(v);
			for (const [nestedK, nestedV] of Object.entries(nestedParams)) result[`${k}.${nestedK}`] = nestedV;
		} else if (typeof v !== "undefined") result[k] = v.toString();
	}
	return result;
};

/**
 * Gets the function that transforms a string to the type of the given value.
 * @param value the value to get the transformer for
 * @returns the transformer function
 */
const getTransformer = (value: any) =>
	typeof value === "number"
		? Number
		: typeof value === "boolean"
		? Boolean
		: typeof value === "object"
		? (value: string) => JSON.parse(value)
		: String;

/** Type with string as keys and string or object as values. */
export type StringOrObject = { [K in string]: string | StringOrObject };

/**
 * Converts URL parameters (key-value pairs) to a StringOrObject object.
 * @param urlParams the URL parameters to convert
 * @returns the StringOrObject object
 */
export const basicUrlParamsToObj = (urlParams: Record<string, string>): StringOrObject => {
	const result: any = {};
	for (const [k, v] of Object.entries(urlParams)) {
		const [key, ...rest] = k.split(".");
		if (rest.length) result[key] = { ...result[key], ...basicUrlParamsToObj({ [rest.join(".")]: v }) };
		else result[key] = v;
	}
	return result;
};

/**
 * Converts a StringOrObject object to an object with the same type as the given filled value object.
 * @param filledValue the filled value object
 * @param urlParamsObj the StringOrObject object to convert
 * @returns the object with the same type as the given filled value object
 */
export const typedUrlParamsObj = (filledValue: Object, urlParamsObj: StringOrObject): Object => {
	const result: any = {};
	for (const [k, v] of Object.entries(urlParamsObj)) {
		if (!(k in filledValue)) continue; // this should not happen
		const filledV = filledValue[k as keyof typeof filledValue];
		if (Array.isArray(filledV)) {
			const transformer = getTransformer(filledV[0]);
			result[k] =
				typeof filledV[0] === "object"
					? Object.values(v).map((value) => typedUrlParamsObj(filledV[0], value as StringOrObject))
					: Object.values(v).map((value) => transformer(value as string));
		} else result[k] = typeof v === "string" ? getTransformer(filledV)(v) : typedUrlParamsObj(filledV, v);
	}
	return result;
};

/**
 * Converts the input of a function from a string to an event.
 * @param fn the function to convert the input of
 * @returns the function that takes an event as input
 */
export const evStringFn = (fn: (value: string) => void) => (ev: ChangeEvent<HTMLInputElement>) => fn(ev.currentTarget.value);

/**
 * Converts the input of a function from a boolean to an event.
 * @param fn the function to convert the input of
 * @returns the function that takes an event as input
 */
export const evBoolFn = (fn: (value: boolean) => void) => (ev: ChangeEvent<HTMLInputElement>) => fn(ev.currentTarget.checked);
