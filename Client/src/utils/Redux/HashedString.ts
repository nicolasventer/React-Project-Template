import type { ISerializable } from "@/utils/Redux/ISerializable";

/**
 * A class for hashing strings.
 * @implements ISerializable - Implements the ISerializable interface.
 */
export class HashedString implements ISerializable {
	private static readonly key = "v";
	private static fastHash = (str: string) => {
		let hash = 0;
		for (let i = 0; i < str.length; i++) {
			hash = (hash << 5) - hash + str.charCodeAt(i);
			hash |= 0;
		}
		return hash.toString(16);
	};

	/** Whether to enable hashing for all instances of the `HashedString` class. */
	public static enableHash = true;

	/** The hash of the string. */
	public hash: string;

	/** The value of the string. */
	private value = new Map<string, string>();

	/**
	 * Constructor for the `HashedString` class.
	 * @param value - The value of the string.
	 * @param hash - The hash of the string, could be provided to override the default hashing function.
	 */
	constructor(value: string = "", hash?: string) {
		this.hash = hash ?? HashedString.enableHash ? HashedString.fastHash(`${value}*****`) : value;
		this.set(value);
	}

	/** Get the value of the string. */
	get() {
		return this.value.get(HashedString.key)!;
	}
	private set(value: string) {
		this.value.set(HashedString.key, value);
		return value;
	}

	/** Create a new `HashedString` instance from a string. */
	fromString(value: string) {
		return new HashedString(value, value);
	}

	/** Convert the `HashedString` instance to a string. */
	toString() {
		return this.hash;
	}

	/** Convert the `HashedString` instance to a JSON string. */
	toJSON() {
		return this.hash;
	}
}
/** Create a new `HashedString` instance. */
export const hashedString = (value: string = "", hash?: string) => new HashedString(value, hash);
