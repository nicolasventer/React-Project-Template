export type Todo = {
	id: string;
	title: string;
	done: boolean;
};

export const DoneFilterValues = ["all", "active", "completed"] as const;

export type DoneFilter = (typeof DoneFilterValues)[number];
