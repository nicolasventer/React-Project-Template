import { WriteClasses, WriteSelectors } from "@/utils/ComponentToolbox";
import { useComputedColorScheme } from "@mantine/core";
import { useEffect, useMemo, useRef, useState } from "react";

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

/** The type of the pinning state */
export type ColumnPinningState<T extends string> = {
	/** The key of the column */
	key: T;
	/** The pinning type of the column */
	pin: ColumnPinningType;
}[];

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
		pinningState: [] as ColumnPinningState<T>,
	};

	/**
	 * Create the pinning state
	 * @param pinnedColumns the pinned columns
	 * @returns the pinning state
	 */
	createPinningState = (pinnedColumns: ColumnPinningState<T> = []): ColumnPinningState<T> => pinnedColumns;

	/**
	 * Set the pinning state, if the pinning state is "none", the column is removed from the pinning state, \
	 * else the column is added or updated for the left at the end of the pinning state and for the right at the beginning of the pinning state.
	 * @param pinningState the pinning state
	 * @param key the key of the column to set the pinning state
	 * @param pin the pinning state to set
	 * @returns the updated pinning state
	 */
	setPinningState = (pinningState: ColumnPinningState<T>, key: T, pin: ColumnPinningType): ColumnPinningState<T> => {
		const result = pinningState.filter((p) => p.key !== key);
		if (pin === "none") return result;
		return pin === "left" ? [...result, { key, pin }] : [{ key, pin }, ...result];
	};

	/**
	 * Get the pinning type
	 * @param pinningState the pinning state
	 * @param key the key of the column to get the pinning type
	 * @returns the pinning type
	 */
	getPinningType = (pinningState: ColumnPinningState<T>, key: T): ColumnPinningType =>
		pinningState.find((p) => p.key === key)?.pin ?? "none";

	/**
	 * Get the compare by pin function to sort the columns by the pinning state, \
	 * sorting by left pinned columns first, then none pinned columns, then right pinned columns, \
	 * and by the index of the column in the pinning state.
	 * @param pinningState the pinning state
	 * @returns the compare by pin function
	 */
	compareByPinFn =
		(pinningState: ColumnPinningState<T>) =>
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
 * Throttles the given function, be sure to store the throttled function in a variable to keep the reference. \
 * The function will be called at most once every `ms` milliseconds and will be called with the last arguments passed. \
 * You can also pass an `onCall` function that will be called with the result of the function. \
 * This `onCall` function will not be triggered by cancelled calls.
 * @example
 * const throttledFn = throttleFn((text: string) => console.log(text), 1000);
 * throttledFn("Hello"); // logs "Hello"
 * throttledFn("World"); // waits 1000ms then logs "World"
 * throttledFn("my friend"); // cancels the previous call and logs "my friend" after 1000ms
 * @template T The type of the arguments of the function.
 * @template U The return type of the function.
 * @param fn The function to throttle.
 * @param ms The milliseconds to wait before calling the function again.
 * @param onCall A function that will be called with the result of the function.
 * @returns The throttled function.
 */
const throttleFn = <T extends unknown[], U>(fn: (...args: T) => U, ms: number, onCall?: (result: U) => void) => {
	let lastCalled = 0;
	let timeout: Timer | undefined;
	let lastValue: U;
	return (...args: T) => {
		const now = Date.now();
		if (now - lastCalled >= ms) {
			lastCalled = now;
			lastValue = fn(...args);
			onCall?.(lastValue);
			return lastValue;
		} else {
			clearTimeout(timeout);
			timeout = setTimeout(() => {
				lastCalled = Date.now();
				lastValue = fn(...args);
				onCall?.(lastValue);
			}, ms - (now - lastCalled));
			return lastValue;
		}
	};
};

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
	getScrollableParent,
}: {
	leftPinningCount: number;
	rightPinningCount: number;
	tableSelector: string;
	tableExcludeClass: string;
	getScrollableParent?: () => HTMLElement;
}) => {
	const theme = useComputedColorScheme();
	const shadowColor = theme === "light" ? "#DFE2E6" : "#424242";

	const [widthArray, setWidthArray] = useState<number[]>([]);
	const cumulWidthArray = useMemo(() => {
		const cumulWidthArray = [2];
		for (let i = 0; i < widthArray.length; i++) cumulWidthArray.push(cumulWidthArray[i] + widthArray[i]);
		return cumulWidthArray;
	}, [widthArray]);
	const [scrollableParentRect, setScrollableParentRect] = useState<DOMRect>();

	const shouldRefreshObserver = useRef(false);
	useEffect(() => void (shouldRefreshObserver.current = true), [tableSelector, leftPinningCount, rightPinningCount]);

	const [isHeightScrolled, setIsHeightScrolled] = useState(false);
	const [isWidthScrolled, setIsWidthScrolled] = useState(false);

	useEffect(() => {
		const firstRowChildNodes: HTMLElement[] = [];
		const resizeObserverCallback: ResizeObserverCallback = (entries) => {
			const newWidthArray = Array(firstRowChildNodes.length).fill(-1);
			entries.forEach((entry) => {
				const childIndex = firstRowChildNodes.findIndex((child) => child === entry.target);
				newWidthArray[childIndex] = entry.target.getBoundingClientRect().width;
			});
			if (newWidthArray.some((w) => w !== -1))
				setWidthArray((widthArray) => newWidthArray.map((w, i) => (w === -1 ? widthArray[i] ?? w : w)));
		};
		const tableResizeObserverCallback: ResizeObserverCallback = (entries) => {
			const rect = entries.at(0)!.target.getBoundingClientRect();
			setScrollableParentRect(rect);
			const table = document.querySelector(tableSelector);
			if (!table) return;
			const tableRect = table.getBoundingClientRect();
			setIsHeightScrolled(tableRect.height > rect.height);
			setIsWidthScrolled(tableRect.width > rect.width);
		};
		const throttleResizeObserverCallback = throttleFn(resizeObserverCallback, 200);
		const tableThrottleResizeObserverCallback = throttleFn(tableResizeObserverCallback, 200);
		const resizeObserver = new ResizeObserver(throttleResizeObserverCallback);
		const tableResizeObserver = new ResizeObserver(tableThrottleResizeObserverCallback);
		const refreshFirstRowChildNodes = () => {
			const firstRow = document.querySelector(`${tableSelector} tr`);
			if (firstRow) {
				firstRowChildNodes.length = 0;
				resizeObserver.disconnect();
				firstRow.childNodes.forEach((child) => {
					if (child instanceof HTMLElement) {
						firstRowChildNodes.push(child);
						resizeObserver.observe(child);
					}
				});
			}
			return !!firstRow;
		};
		if (shouldRefreshObserver.current) {
			shouldRefreshObserver.current = false;
			refreshFirstRowChildNodes();
		}
		const refreshWidthArray = () => {
			if (refreshFirstRowChildNodes()) {
				clearInterval(intervalId);
				const table = document.querySelector(tableSelector);
				if (!table) return; // this should never happen
				const getScrollableParentOfTable = () => {
					let scrollableParent = table.parentElement;
					// @ts-expect-error CSSStyleValue is wrongly typed
					while (scrollableParent && scrollableParent.computedStyleMap().get("overflow-x")?.value !== "auto")
						scrollableParent = scrollableParent.parentElement;
					return scrollableParent;
				};
				const scrollableParent = getScrollableParent ? getScrollableParent() : getScrollableParentOfTable();
				if (scrollableParent) tableResizeObserver.observe(scrollableParent);
			}
		};
		const intervalId = setInterval(refreshWidthArray, 200);
		return () => clearInterval(intervalId);
	}, [getScrollableParent, tableSelector]);
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
							zIndex: "250",
							// boxShadow: `inset -0.0625rem 0px 0px 0px ${shadowColor}`,
						},
					])
				),
				...Object.fromEntries(
					Array.from({ length: rightPinningCount }, (_, i) => [
						getSelector(i + 1, "right"),
						{ position: "sticky", right: `${cumulWidthArray.at(-1)! - cumulWidthArray.at(-i - 1)! + 2}px`, zIndex: "250" },
					])
				),
				// html only to avoid key collision
				["html " + getSelector(leftPinningCount, "left")]: {
					boxShadow: `inset -0.625rem 0px 0.625rem -0.625rem ${shadowColor}`,
				},
				// * only to avoid key collision
				["html " + getSelector(rightPinningCount, "right")]: {
					boxShadow: `inset 0.625rem 0px 0.625rem -0.625rem ${shadowColor}`,
				},
			},
			`.${tableExcludeClass}`
		);
	}, [leftPinningCount, rightPinningCount, tableExcludeClass, tableSelector, cumulWidthArray, shadowColor]);
	const LEFT_PINNING_BORDER_CLASS = "column-pinning-left-border";
	const RIGHT_PINNING_BORDER_CLASS = "column-pinning-right-border";
	useEffect(() => {
		const horizontalOffset = isHeightScrolled ? 8 : 0; // 8px is ::-webkit-scrollbar width
		const verticalOffset = isWidthScrolled ? 8 : 0; // 8px is ::-webkit-scrollbar height
		WriteClasses(
			`${tableSelector}-column-pinning-css-2`,
			{
				[LEFT_PINNING_BORDER_CLASS]: {
					position: "fixed",
					left: `${scrollableParentRect?.left}px`,
					top: `${scrollableParentRect?.top}px`,
					height: `${(scrollableParentRect?.height ?? 0) - verticalOffset}px`,
					width: "2px",
					backgroundColor: shadowColor,
					zIndex: "300",
				},
				[RIGHT_PINNING_BORDER_CLASS]: {
					position: "fixed",
					left: `${(scrollableParentRect?.right ?? 0) - horizontalOffset - 2}px`, // 2px is the width of the border
					top: `${scrollableParentRect?.top}px`,
					height: `${(scrollableParentRect?.height ?? 0) - verticalOffset}px`,
					width: "3px",
					backgroundColor: shadowColor,
					zIndex: "300",
				},
			},
			`.${tableExcludeClass}`
		);
	}, [shadowColor, tableExcludeClass, scrollableParentRect, tableSelector, isHeightScrolled, isWidthScrolled]);
	return (
		<>
			<div className={LEFT_PINNING_BORDER_CLASS} />
			<div className={RIGHT_PINNING_BORDER_CLASS} />
		</>
	);
};
