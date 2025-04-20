import type { ISerializable } from "@/utils/Redux/ISerializable";

/**
 * A class for serializing and deserializing dates.
 * @implements ISerializable - Implements the ISerializable interface.
 */
export class SDate implements ISerializable {
	/**
	 * Constructor for the `SDate` class.
	 * @param value - The date value.
	 */
	constructor(private value = new Date()) {}

	/** Get the date value. */
	get() {
		return this.value;
	}

	/**
	 * Create a new `SDate` instance from a string.
	 * @param value - The date value.
	 */
	fromString(value: string) {
		return new SDate(new Date(value));
	}

	/** Convert the `SDate` instance to a string. */
	toString() {
		return this.value.toISOString();
	}

	/** Convert the `SDate` instance to a JSON string. */
	toJSON() {
		return this.value.toISOString();
	}
}
