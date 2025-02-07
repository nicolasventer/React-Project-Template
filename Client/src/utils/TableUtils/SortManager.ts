/** The parameters of the constructor of the SortManager class */
export type SortManagerOptions<T extends string, U> = Record<T, (a: U, b: U) => number>;

/**
 * Class to manage the sorting of a table
 * @template T the type of the sort keys
 * @template U the type of a single data
 */
export class SortManager<T extends string, U> {
	/** Object to retrieve the types of the sort manager */
	types = {
		/** The type of the sort keys */
		key: "" as T,
		/** The type of the data */
		data: null as unknown as U[],
		/** The type of the sort state */
		sortState: [] as {
			/** The key of the sort */
			key: T;
			/** Whether the sort is ascending */
			asc: boolean;
		}[],
	};

	/**
	 * The constructor for the sort manager
	 * @param compareFns the compare functions
	 */
	constructor(private compareFns: SortManagerOptions<T, U>) {}

	/**
	 * Sort the data
	 * @param data the data to sort
	 * @param sortState the sort state
	 * @returns the sorted data
	 */
	sortData = <V extends U>(data: V[], sortState: SortManager<T, U>["types"]["sortState"]) =>
		data.toSorted((a, b) => {
			for (const { key, asc } of sortState) {
				const result = this.compareFns[key](a, b);
				if (result !== 0) return result * (asc ? 1 : -1);
			}
			return 0;
		});

	/**
	 * Create the sort state
	 * @param initialState the initial state of the sort
	 * @returns the sort state
	 */
	createSortState = (initialState: SortManager<T, U>["types"]["sortState"] = []): SortManager<T, U>["types"]["sortState"] =>
		initialState;

	/**
	 * Get all the keys of the sort
	 * @returns the keys of the sort
	 */
	getAllKeys = () => Object.keys(this.compareFns) as T[];

	// TODO: option to change the toggle order

	/**
	 * Toggle the sort state, the toggle order is ascending -> descending -> not active
	 * @param sortState the sort state
	 * @param key the key of the sort to toggle
	 * @param bAdditive whether to toggle the sort state in an additive way
	 * @returns the updated sort state
	 */
	toggleSortState = (
		sortState: SortManager<T, U>["types"]["sortState"],
		key: T,
		bAdditive: boolean
	): SortManager<T, U>["types"]["sortState"] => {
		const index = sortState.findIndex(({ key: k }) => k === key);
		if (index === -1)
			if (bAdditive) return [...sortState, { key, asc: true }];
			else return [{ key, asc: true }];
		else if (sortState[index].asc) return sortState.with(index, { key, asc: false });
		else return sortState.filter(({ key: k }) => k !== key);
	};
}
