/** The parameters of the constructor of the FilterManager class */
export type FilterManagerOptions<T extends string, U> = Record<T, (singleData: U, values: string[]) => boolean>;

/** The type of the filter state */
export type FilterState<T extends string> = { [key in T]?: string[] };

/**
 * Class to manage the filters of a table
 * @template T the type of the filter keys
 * @template U the type of a single data
 */
export class FilterManager<T extends string, U> {
	/** Object to retrieve the types of the filter manager */
	types = {
		/** The type of the filter keys */
		key: "" as T,
		/** The type of the data */
		data: null as unknown as U[],
		/** The type of the filter state */
		filterState: {} as FilterState<T>,
	};

	/**
	 * The constructor for the filter manager
	 * @param filterFns the filter functions
	 */
	constructor(public filterFns: FilterManagerOptions<T, U>) {}

	/**
	 * Create the filter state
	 * @param initialState the initial state of the filter
	 * @returns the filter state
	 */
	createFilterState = (initialState: FilterState<T> = {}): FilterState<T> => initialState;

	/**
	 * Filter the data
	 * @param data the data to filter
	 * @param filterState the filter state
	 * @returns the filtered data
	 */
	filterData = <V extends U>(data: V[], filterState: FilterState<T>) =>
		data.filter((t) => Object.entries(filterState).every(([key, values]) => this.filterFns[key as T](t, values as string[])));

	/**
	 * Validate the filter state
	 * @param filterState the filter state
	 * @returns the validated filter state
	 */
	validFilterState = (filterState: FilterState<T>): FilterState<T> => {
		const result = { ...filterState };
		for (const key of Object.keys(result)) if (!this.isFilterActive(filterState, key as T)) delete result[key as T];
		return result;
	};

	/**
	 * Get all the keys of the filters
	 * @returns the keys of the filters
	 */
	getAllKeys = () => Object.keys(this.filterFns) as T[];

	/**
	 * Check if a filter is active
	 * @param filterState the filter state
	 * @param key the key of the filter to check
	 * @returns whether the filter is active
	 */
	isFilterActive = (filterState: FilterState<T>, key: T) => (filterState[key]?.filter(Boolean).length ?? 0) > 0;
}

/**
 * Utility functions for the filter manager
 */
export const FilterUtils = {
	/**
	 * Create a filter function that filters a data whose text contains some or all of the values depending on the specified type
	 * @param type the type of the filter function ("or" or "and")
	 * @param getText the function to get the text from the data
	 * @param options the options for the filter function
	 * @param {boolean} [options.ignoreCase=true] whether to ignore the case of the text (default: true)
	 * @param {boolean} [options.wholeWord=false] whether to filter the data whose text contains all of the values (default: false)
	 * @returns the filter function
	 */
	textFilterFn: <T>(
		type: "or" | "and",
		getText: (t: T) => string | string[],
		options: { ignoreCase?: boolean; wholeWord?: boolean } = {}
	) => {
		const { ignoreCase = true, wholeWord = false } = options;

		return (t: T, values: string[]) => {
			const matchFn = type === "or" ? "some" : "every";
			let v = values.filter(Boolean);
			let text = getText(t);
			if (typeof text === "string") text = [text];
			if (ignoreCase) {
				v = v.map((value) => value.toLowerCase());
				text = text.map((t) => t.toLowerCase());
			}
			if (wholeWord) {
				const vRegexArray = v.map((value) => `\\b${value}\\b`).map((vRegex) => new RegExp(vRegex, ignoreCase ? "i" : ""));
				return v.length === 0 || vRegexArray[matchFn]((vRegex) => text.some((t) => t.match(vRegex)));
			}
			return v.length === 0 || v[matchFn]((value) => text.some((t) => t.includes(value)));
		};
	},
};
