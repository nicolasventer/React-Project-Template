/** The parameters of the constructor of the FilterManager class */
export type FilterManagerOptions<T extends string, U> = Record<T, (singleData: U, values: string[]) => boolean>;

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
		filterState: {} as { [key in T]?: string[] },
	};

	/**
	 * The constructor for the filter manager
	 * @param filterFns the filter functions
	 */
	constructor(private filterFns: FilterManagerOptions<T, U>) {}

	/**
	 * Create the filter state
	 * @param initialState the initial state of the filter
	 * @returns the filter state
	 */
	createFilterState = (
		initialState: FilterManager<T, U>["types"]["filterState"] = {}
	): FilterManager<T, U>["types"]["filterState"] => initialState;

	/**
	 * Filter the data
	 * @param data the data to filter
	 * @param filterState the filter state
	 * @returns the filtered data
	 */
	filterData = <V extends U>(data: V[], filterState: FilterManager<T, U>["types"]["filterState"]) =>
		data.filter((t) => Object.entries(filterState).every(([key, values]) => this.filterFns[key as T](t, values as string[])));

	/**
	 * Validate the filter state
	 * @param filterState the filter state
	 * @returns the validated filter state
	 */
	validFilterState = (filterState: FilterManager<T, U>["types"]["filterState"]): FilterManager<T, U>["types"]["filterState"] => {
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
	isFilterActive = (filterState: FilterManager<T, U>["types"]["filterState"], key: T) =>
		(filterState[key]?.filter(Boolean).length ?? 0) > 0;
}

/**
 * Utility functions for the filter manager
 */
export const FilterUtils = {
	/**
	 * Create a filter function that filters a data whose text contains any of the values
	 * @param getText the function to get the text from the data
	 * @param {boolean} [ignoreCase=true] whether to ignore the case of the text (default: true)
	 * @returns the filter function
	 */
	textOrFilterFn: <T>(getText: (t: T) => string | string[], ignoreCase = true) =>
		ignoreCase
			? (t: T, values: string[]) => {
					const v = values.filter(Boolean);
					return (
						v.length === 0 ||
						v.some((value) => {
							const text = getText(t);
							if (typeof text === "string") return text.toLowerCase().includes(value.toLowerCase());
							return text.some((t) => t.toLowerCase().includes(value.toLowerCase()));
						})
					);
			  }
			: (t: T, values: string[]) => {
					const v = values.filter(Boolean);
					return (
						v.length === 0 ||
						v.some((value) => {
							const text = getText(t);
							if (typeof text === "string") return text.includes(value);
							return text.some((t) => t.includes(value));
						})
					);
			  },

	/**
	 * Create a filter function that filters a data whose text contains all of the values
	 * @param getText the function to get the text from the data
	 * @param {boolean} [ignoreCase=true] whether to ignore the case of the text (default: true)
	 * @returns the filter function
	 */
	textAndFilterFn: <T>(getText: (t: T) => string | string[], ignoreCase = true) =>
		ignoreCase
			? (t: T, values: string[]) => {
					const v = values.filter(Boolean);
					return (
						v.length === 0 ||
						v.every((value) => {
							const text = getText(t);
							if (typeof text === "string") return text.toLowerCase().includes(value.toLowerCase());
							return text.some((t) => t.toLowerCase().includes(value.toLowerCase()));
						})
					);
			  }
			: (t: T, values: string[]) => {
					const v = values.filter(Boolean);
					return (
						v.length === 0 ||
						v.every((value) => {
							const text = getText(t);
							if (typeof text === "string") return text.includes(value);
							return text.some((t) => t.includes(value));
						})
					);
			  },
};
