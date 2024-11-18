import { effect, type ReadonlySignal, signal, Signal } from "@preact/signals";
import { objDiffStr } from "./clientUtils";

/**
 * Type corresponding to a recursive read-only signal.
 * @example
 * type RecursiveReadOnlySignal = RecursiveReadOnlySignal<Signal<number>>; // ReadonlySignal<number>
 * type RecursiveReadOnlyArraySignal = RecursiveReadOnlySignal<Signal<number>[]>; // ReadonlySignal<number>[]
 * type RecursiveReadOnlyObjectSignal = RecursiveReadOnlySignal<{ a: Signal<number> }>; // { a: ReadonlySignal<number> }
 */
export type RecursiveReadOnlySignal<T> = T extends Signal<infer U>
	? ReadonlySignal<RecursiveReadOnlySignal<U>>
	: T extends (infer U)[]
	? RecursiveReadOnlySignal<U>[]
	: T extends object
	? { [K in keyof T]: RecursiveReadOnlySignal<T[K]> }
	: T;

/**
 * Type corresponding to the value of a signal.
 * @example
 * type SignalValue = SignalToValue<Signal<number>>; // number
 * type SignalArrayValue = SignalToValue<Signal<number>[]>; // number[]
 * type SignalObjectValue = SignalToValue<{ a: Signal<number> }>; // { a: number }
 */
export type SignalToValue<T> = T extends Signal<infer U>
	? SignalToValue<U>
	: T extends Signal<infer U>[]
	? SignalToValue<U>[]
	: T extends object
	? { [K in keyof T]: SignalToValue<T[K]> }
	: T;

/**
 * Converts a signal to its value recursively.
 * @param signal the signal to convert
 * @returns the value corresponding to the signal
 * @example
 * const s1 = signal(5);
 * const value = signalToValue(s1); // 5
 * const s2 = signal({ a: signal(5) });
 * const value2 = signalToValue(s2); // { a: 5 }
 * const s3 = signal([signal(5)]);
 * const value3 = signalToValue(s3); // [5]
 */
export const signalToValue = <T>(signal: T): SignalToValue<T> => {
	if (signal instanceof Signal) return signalToValue(signal.value);
	if (Array.isArray(signal)) return signal.map(signalToValue) as SignalToValue<T>;
	if (typeof signal === "object") {
		const obj: Record<string, any> = {};
		for (const key in signal) obj[key] = signalToValue(signal[key]);
		return obj as SignalToValue<T>;
	}
	return signal as SignalToValue<T>;
};

/**
 * Type corresponding to a signal of a value.
 * @example
 * type ValueSignal = ValueToSignal<number>; // Signal<number>
 * type ArrayValueSignal = ValueToSignal<number[]>; // Signal<Signal<number>[]> (array is a special case)
 * type ObjectValueSignal = ValueToSignal<{ a: number }>; // { a: Signal<number> }
 */
export type ValueToSignal<T> = T extends (infer U)[]
	? Signal<ValueToSignal<U>[]>
	: T extends object
	? { [K in keyof T]: ValueToSignal<T[K]> }
	: Signal<T>;

/**
 * Converts a value to a signal recursively.
 * @param value the value to convert
 * @returns the signal corresponding to the value
 * @example
 * const v1 = 5;
 * const signal1 = valueToSignal(v1); // signal(5)
 * const v2 = { a: 5 };
 * const signal2 = valueToSignal(v2); // { a: signal(5) }
 * const v3 = [5];
 * const signal3 = valueToSignal(v3); // signal([signal(5)]) (array is a special case)
 */
export const valueToSignal = <T>(value: T): ValueToSignal<T> => {
	if (value instanceof Signal) return value as ValueToSignal<T>;
	if (Array.isArray(value)) return signal(value.map(valueToSignal)) as ValueToSignal<T>;
	if (typeof value === "object") {
		const obj: Record<string, any> = {};
		for (const key in value) obj[key] = valueToSignal(value[key]);
		return obj as ValueToSignal<T>;
	}
	return signal(value) as ValueToSignal<T>;
};

/**
 * Creates a signal that shows a toast with the difference between the old and new value.
 * @param initialValue the initial value of the signal
 * @param onDiff the function to call when a difference is detected
 * @returns the signal
 */
export const signalWithDiff = <T>(initialValue: T, onDiff: (diffStr: string) => void) => {
	const oldSignal = signal<T>(initialValue);
	const newSignal = signal<T>(initialValue);
	effect(() => {
		const oldSignalValue = oldSignal.peek();
		const newSignalValue = newSignal.value;
		const diffStr =
			typeof oldSignalValue === "object"
				? objDiffStr(oldSignalValue ?? {}, typeof newSignalValue === "object" ? newSignalValue ?? {} : {})
				: oldSignalValue !== newSignalValue
				? `${oldSignalValue} --> ${newSignalValue}`
				: "";
		if (!diffStr) return;
		onDiff(diffStr);
		oldSignal.value = newSignal.value;
	});
	return newSignal;
};

/** Creates a signal with a time value. The time is updated every time the value is updated. */
export class SignalWithTime<T> extends Signal<{
	/** The value of the signal. */
	val: T;
	/** The time of the last update of the signal. */
	time: number;
}> {
	/**
	 * Creates a signal with a time value. The time is updated every time the value is updated.
	 * @param initialValue the initial value of the signal
	 * @param initialTime the initial time of the signal
	 * @returns the signal
	 */
	constructor(initialValue: T, initialTime = Date.now()) {
		super({ val: initialValue, time: initialTime });
	}

	/** Get the value of the signal. (not named `v` since it is already defined in Signal) */
	get vv() {
		return this.value.val;
	}

	/** Set the value of the signal. (not named `v` since it is already defined in Signal) */
	set vv(v: T) {
		this.value = { val: v, time: Date.now() };
	}

	/** Updates the time of the signal to the current time. */
	refreshTime() {
		this.value = { val: this.peek().val, time: Date.now() };
	}
}

/** Creates a signal with a time value. The time is updated every time the value is updated. */
export const signalWithTime = <T>(initialValue: T, time = Date.now()) => new SignalWithTime(initialValue, time);

/**
 * Synchronizes two signals with a time value. The signal with the earliest time is updated with the value of the other signal.
 * @param signal1 the first signal
 * @param signal2 the second signal
 */
export const syncSignalWithTime = <T>(signal1: SignalWithTime<T>, signal2: SignalWithTime<T>) =>
	signal1.value.time < signal2.value.time ? (signal1.value = signal2.value) : (signal2.value = signal1.value);
