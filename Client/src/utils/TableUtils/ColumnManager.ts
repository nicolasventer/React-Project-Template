/** The parameters of the constructor of the ColumnManager class */
export type ColumnManagerOptions<T extends string, U> = {
	[key in T]: U & {
		/** The key of the column */
		key: key;
	};
};

/** The type of the column state */
export type ColumnState<T extends string> = {
	/** The key of the column */
	key: T;
	/** Whether the column is visible */
	isVisible: boolean;
}[];

/**
 * Class to manage the visibility of the columns in a table
 * @template T the type of the column keys
 * @template U the type of the column values
 */
export class ColumnManager<T extends string, U> {
	/** Object to retrieve the types of the column manager */
	types = {
		/** The type of the column keys */
		key: "" as T,
		/** The type of the column state */
		columnState: [] as ColumnState<T>,
		/** The type of the column value */
		value: null as unknown as U & {
			/** The key of the column */
			key: T;
		},
	};

	/**
	 * The constructor for the column manager
	 * @param columns the columns whose visibility can be updated
	 */
	constructor(public columns: ColumnManagerOptions<T, U>) {}

	/**
	 * Create the column state, the order is defined by the order of the keys of the object used in the constructor
	 * @param {T[]} [visibleColumns=[]] the columns that are visible (default: [])
	 * @returns the column state
	 */
	createColumnState = (visibleColumns: T[] = []): ColumnState<T> =>
		this.getAllKeys().map((key) => ({ key, isVisible: visibleColumns.includes(key) }));

	/**
	 * Create the column state, the order is defined by the order of the keys of the object used in this function
	 * @param {Record<T, boolean>} columns all the columns with their visibility
	 * @returns the column state
	 */
	createOrderedColumnState = (columns: Record<T, boolean>): ColumnState<T> =>
		Object.entries(columns).map(([key, isVisible]) => ({ key: key as T, isVisible: isVisible as boolean }));

	/**
	 * Get the visible column values
	 * @param columnState the column state
	 * @returns the visible column values
	 */
	getVisibleColumnsValues = (columnState: ColumnState<T>) =>
		columnState.filter((column) => column.isVisible).map((column) => this.columns[column.key]);

	/**
	 * Get all the keys of the columns
	 * @returns the keys of the columns
	 */
	getAllKeys = (): T[] => Object.keys(this.columns) as T[];

	/**
	 * Toggle the visibility of a column
	 * @param columnState the column state
	 * @param key the key of the column to toggle
	 * @returns the updated column state
	 */
	toggleColumnVisibility = (columnState: ColumnState<T>, key: T): ColumnState<T> =>
		columnState.map((k) => (k.key === key ? { ...k, isVisible: !k.isVisible } : k));

	/**
	 * Check if a column is visible
	 * @param columnState the column state
	 * @param key the key of the column to check
	 * @returns whether the column is visible
	 */
	isColumnVisible = (columnState: ColumnState<T>, key: T) => !!columnState.find((k) => k.key === key)?.isVisible;
}
