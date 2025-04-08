// eslint-disable-next-line project-structure/independent-modules
import type { Route } from "@/routerInstance.gen";
import { effect, type ReadonlySignal, untracked } from "@preact/signals";

/** The parameters of the constructor of the Events class */
export type EventsOptions<T extends string> = {
	/** The functions to call when the page is loaded */
	onPageLoad: {
		/** The function to call */
		fn: () => unknown;
		/** The pages that trigger the function when loaded */
		pages: Route[];
	}[];
	/** The functions to call when the interval is triggered (`untracked` of `@preact/signals` is used) */
	intervals: Record<
		T,
		{
			/** The function to call */
			fn: () => unknown;
			/** The delay of the interval */
			msDelay: number;
		}
	>;
	/**
	 * The functions to call when the value of a signal changes (`effect` of `@preact/signals` is used) or \
	 * an array with a signal and the interval key that should be started or stopped according to the signal.
	 */
	onDataChange: (
		| (() => unknown)
		| {
				/** The signal that tells whether the interval should be started or stopped. */
				shouldStartSignal: ReadonlySignal<boolean>;
				/** The interval that is started or stopped according to the signal. */
				intervalName: T;
		  }
	)[];
};

/**
 * Class to manage the events of the application
 * @template T the type of the keys of the registered intervals
 */
export class Events<T extends string> {
	/** The map of the started intervals, the key is the signal that controls the interval, the value is the function that stops the interval */
	private startedIntervalMap = new Map<ReadonlySignal<boolean>, () => void>();

	constructor(private events: EventsOptions<T>) {}

	/**
	 * Call `effect` on all the registered functions, these functions should depend on a signal. \
	 * If the function is associated with an interval, the interval is started if the function returns `true` and stopped if it returns `false`.
	 */
	registerOnDataChange = () => {
		for (const value of this.events.onDataChange) {
			if (typeof value === "function") effect(() => void value());
			else {
				effect(() => {
					const { shouldStartSignal, intervalName } = value;
					const stopIntervalFn = this.startedIntervalMap.get(shouldStartSignal);
					if (shouldStartSignal.value) {
						if (!stopIntervalFn) this.startedIntervalMap.set(shouldStartSignal, this.startInterval(intervalName));
					} else {
						if (stopIntervalFn) {
							stopIntervalFn();
							this.startedIntervalMap.delete(shouldStartSignal);
						}
					}
				});
			}
		}
	};

	/**
	 * Call the registered functions that depend on the current page
	 * @param page the current page
	 */
	executeOnPageLoad = (page: Route) => {
		for (const value of this.events.onPageLoad) if (value.pages.includes(page)) value.fn();
	};

	/**
	 * Start an interval that calls the registered function. The function is called with `untracked` of `@preact/signals`.
	 * @param key the key of the interval
	 * @returns a function to stop the interval
	 */
	startInterval = (key: T) => {
		const value = this.events.intervals[key];
		const fn = () => untracked(value.fn);
		fn();
		const interval = setInterval(fn, value.msDelay);
		return () => clearInterval(interval);
	};
}
