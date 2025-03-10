import { WriteSelectors } from "@/utils/ComponentToolbox";
import { useEffect, useMemo, useState } from "react";

/** The type of the column pinning */
export type ColumnPinningType = "left" | "none" | "right";

const pinTypeToNumber: Record<ColumnPinningType, number> = {
	left: -1,
	none: 0,
	right: 1,
};

/**
 * The type of an object with a key
 * @template T the type of the key
 */
type ObjWithKey<T extends string> = {
	/** The key of the object */
	key: T;
};

/**
 * Class to manage the pinning of the columns in a table
 * @template T the type of the column keys
 */
export class ColumnPinningManager<T extends string> {
	/** Object to retrieve the types of the column manager */
	types = {
		/** The type of the column keys */
		key: "" as T,
		/** The type of the column pinning state */
		pinningState: [] as {
			/** The key of the column */
			key: T;
			/** The pinning type of the column */
			pin: ColumnPinningType;
		}[],
	};

	/**
	 * Create the pinning state
	 * @param pinnedColumns the pinned columns
	 * @returns the pinning state
	 */
	createPinningState = (pinnedColumns: typeof this.types.pinningState = []): typeof this.types.pinningState => pinnedColumns;

	/**
	 * Set the pinning state, if the pinning state is "none", the column is removed from the pinning state, \
	 * else the column is added or updated at the end of the pinning state.
	 * @param pinningState the pinning state
	 * @param key the key of the column to set the pinning state
	 * @param pin the pinning state to set
	 * @returns the updated pinning state
	 */
	setPinningState = (
		pinningState: ColumnPinningManager<T>["types"]["pinningState"],
		key: T,
		pin: ColumnPinningType
	): ColumnPinningManager<T>["types"]["pinningState"] => {
		const result = pinningState.filter((p) => p.key !== key);
		if (pin === "none") return result;
		return [...result, { key, pin }];
	};

	/**
	 * Get the pinning type
	 * @param pinningState the pinning state
	 * @param key the key of the column to get the pinning type
	 * @returns the pinning type
	 */
	getPinningType = (pinningState: ColumnPinningManager<T>["types"]["pinningState"], key: T): ColumnPinningType =>
		pinningState.find((p) => p.key === key)?.pin ?? "none";

	/**
	 * Get the compare by pin function to sort the columns by the pinning state, \
	 * sorting by left pinned columns first, then none pinned columns, then right pinned columns, \
	 * and by the index of the column in the pinning state.
	 * @param pinningState the pinning state
	 * @returns the compare by pin function
	 */
	compareByPinFn =
		(pinningState: ColumnPinningManager<T>["types"]["pinningState"]) =>
		<U extends ObjWithKey<T>>(a: U, b: U) => {
			const aPinIndex = pinningState.findIndex((p) => p.key === a.key);
			const bPinIndex = pinningState.findIndex((p) => p.key === b.key);
			const aPin = pinningState[aPinIndex]?.pin ?? "none";
			const bPin = pinningState[bPinIndex]?.pin ?? "none";
			return pinTypeToNumber[aPin] - pinTypeToNumber[bPin] || aPinIndex - bPinIndex;
		};

	/**
	 * Get the pinning count
	 * @param pinningState the pinning state
	 * @param type the type of the pinning
	 * @returns the pinning count
	 */
	getPinningCount = (pinningState: ColumnPinningManager<T>["types"]["pinningState"], type: ColumnPinningType) =>
		pinningState.filter((p) => p.pin === type).length;
}

/**
 * Write the column pinning style
 * @param params
 * @param params.leftPinningCount the number of left pinned columns
 * @param params.rightPinningCount the number of right pinned columns
 * @param params.tableSelector the selector of the table
 * @param params.tableExcludeClass the exclude class of the table
 */
export const WriteColumnPinningStyle = ({
	leftPinningCount,
	rightPinningCount,
	tableSelector,
	tableExcludeClass,
}: {
	leftPinningCount: number;
	rightPinningCount: number;
	tableSelector: string;
	tableExcludeClass: string;
}) => {
	const [widthArray, setWidthArray] = useState<number[]>([]);
	const cumulWidthArray = useMemo(() => {
		const cumulWidthArray = [0];
		for (let i = 0; i < widthArray.length; i++) cumulWidthArray.push(cumulWidthArray[i] + widthArray[i]);
		return cumulWidthArray;
	}, [widthArray]);
	useEffect(() => {
		const firstRowChildNodes: HTMLElement[] = [];
		const resizeObserver = new ResizeObserver((entries) => {
			const newWidthArray: number[] = [];
			entries.forEach((entry) => {
				const childIndex = firstRowChildNodes.findIndex((child) => child === entry.target);
				while (newWidthArray.length < childIndex + 1) newWidthArray.push(-1);
				newWidthArray[childIndex] = entry.target.getBoundingClientRect().width;
			});
			if (newWidthArray.some((w) => w !== -1))
				setWidthArray((widthArray) => newWidthArray.map((w, i) => (w === -1 ? widthArray[i] : w)));
		});
		const refreshWidthArray = () => {
			const firstRow = document.querySelector(`${tableSelector} tr`);
			if (firstRow) {
				firstRow.childNodes.forEach((child) => {
					if (child instanceof HTMLElement) {
						firstRowChildNodes.push(child);
						resizeObserver.observe(child);
					}
				});
				clearInterval(intervalId);
			}
		};
		const intervalId = setInterval(refreshWidthArray, 200);
		return () => clearInterval(intervalId);
	}, [tableSelector]);
	useEffect(() => {
		const getSelector = (index: number, direction: "left" | "right") => {
			const childSelector = direction === "left" ? "nth-child" : "nth-last-child";
			return `${tableSelector} tr[data-item-index] > th:${childSelector}(${index}),
					${tableSelector} tr[data-item-index] > td:${childSelector}(${index}),
					${tableSelector} thead th:${childSelector}(${index}),
					${tableSelector} thead td:${childSelector}(${index}),
					${tableSelector} tfoot th:${childSelector}(${index}),
					${tableSelector} tfoot td:${childSelector}(${index})`;
		};
		WriteSelectors(
			`${tableSelector}-column-pinning-css`,
			{
				...Object.fromEntries(
					Array.from({ length: leftPinningCount }, (_, i) => [
						getSelector(i + 1, "left"),
						{
							position: "sticky",
							left: `${cumulWidthArray[i]}px`,
							zIndex: "2",
							boxShadow: "inset -0.0625rem 0px 0px 0px #424242",
						},
					])
				),
				...Object.fromEntries(
					Array.from({ length: rightPinningCount }, (_, i) => [
						getSelector(i + 1, "right"),
						{ position: "sticky", right: `${cumulWidthArray.at(-1)! - cumulWidthArray.at(-i - 1)!}px`, zIndex: "2" },
					])
				),
				// html only to avoid key collision
				["html " + getSelector(leftPinningCount, "left")]: {
					boxShadow: "inset -0.625rem 0px 0.625rem -0.625rem #424242",
				},
				// * only to avoid key collision
				["html " + getSelector(rightPinningCount, "right")]: {
					boxShadow: "inset 0.625rem 0px 0.625rem -0.625rem #424242",
				},
			},
			`.${tableExcludeClass}`
		);
	}, [leftPinningCount, rightPinningCount, tableExcludeClass, tableSelector, cumulWidthArray]);
	return <></>;
};
