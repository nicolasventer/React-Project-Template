import { WriteSelectors } from "@/utils/ComponentToolbox";
import { useComputedColorScheme } from "@mantine/core";
import clsx from "clsx";
import { useEffect, useMemo, useRef, useState } from "react";

type BaseResizeHandleProps = {
	index: number;
	width: number;
	setWidth: (width: number) => void;
	onStartResize?: () => void;
	onEndResize?: () => void;
	onDoubleClick?: () => void;
	tableSelector: string;
};

// eslint-disable-next-line react-refresh/only-export-components
const BaseResizeHandle = ({
	index,
	width,
	setWidth,
	onStartResize,
	onEndResize,
	tableSelector,
	onDoubleClick,
}: BaseResizeHandleProps) => {
	const [isResizing, setIsResizing] = useState(false);
	const initialClientX = useRef(0);

	const theme = useComputedColorScheme();

	const onMouseMove = (e: MouseEvent) => {
		const delta = e.clientX - initialClientX.current;
		setWidth(width + delta);
	};

	const onMouseUp = () => {
		setIsResizing(false);
		document.removeEventListener("mousemove", onMouseMove);
		document.removeEventListener("mouseup", onMouseUp);
		onEndResize?.();
	};

	const onMouseDown = (ev: React.MouseEvent<HTMLDivElement>) => {
		ev.preventDefault();
		initialClientX.current = ev.clientX;
		setIsResizing(true);
		onStartResize?.();
		document.addEventListener("mousemove", onMouseMove);
		document.addEventListener("mouseup", onMouseUp);
	};

	const onTouchMove = (ev: TouchEvent) => {
		const delta = ev.touches[0].clientX - initialClientX.current;
		setWidth(width + delta);
	};

	const onTouchEnd = () => {
		setIsResizing(false);
		document.removeEventListener("touchmove", onTouchMove);
		document.removeEventListener("touchend", onTouchEnd);
		onEndResize?.();
	};

	const onTouchStart = (ev: React.TouchEvent<HTMLDivElement>) => {
		ev.stopPropagation();
		initialClientX.current = ev.touches[0].clientX;
		setIsResizing(true);
		onStartResize?.();
		document.addEventListener("touchmove", onTouchMove);
		document.addEventListener("touchend", onTouchEnd);
	};

	useEffect(() => {
		const resizingTableSelector = `${tableSelector}:has(.resize-handle-${index}.resizing)`;
		const hoverTableSelector = `${tableSelector}:has(.resize-handle-${index}:hover)`;
		WriteSelectors(`resize-handle-${index}-css`, {
			[`${resizingTableSelector} td:nth-of-type(${index + 2}), ${resizingTableSelector} th:nth-of-type(${index + 2})`]: {
				borderLeft: `solid 1px ${theme === "light" ? "blue" : "yellow"}`,
			},
			[`${hoverTableSelector}:not(:has(.resizing)) th:nth-of-type(${index + 2})`]: {
				borderLeft: "solid 1px gray",
			},
		});
	}, [index, tableSelector, theme]);

	return (
		<div
			className={clsx("resize-handle", `resize-handle-${index}`, { resizing: isResizing })}
			onMouseDown={onMouseDown}
			onTouchStart={onTouchStart}
			// eslint-disable-next-line @typescript-eslint/ban-ts-comment
			// @ts-ignore Invalid type from Preact
			onDoubleClick={onDoubleClick}
		/>
	);
};

/** The parameters of the useColumnWidth hook */
export type UseColumnWidthProps = {
	/** The initial width array */
	initialWidthArray: number[];
	/** Whether to resize the headers first */
	isResizeHeaderFirst?: boolean;
	/** The table selector */
	tableSelector: string;
};

/** The return type of the useColumnWidth hook */
export type UseColumnWidthReturn = {
	/** The width array */
	widthArray: number[];
	/** The setWidthArray function */
	setWidthArray: (widthArray: number[]) => void;
	/** The ResizeHandle component */
	ResizeHandle: React.FC<{
		/** The index of the column */
		index: number;
	}>;
};

/**
 * Hook to manage the column widths of a table
 * @param props
 * @param props.initialWidthArray the initial width array
 * @param props.isResizeHeaderFirst whether to resize the headers first
 * @param props.tableSelector the table selector
 * @returns the width array, the setWidthArray function and the ResizeHandle component
 */
export const useColumnWidth = ({
	initialWidthArray,
	isResizeHeaderFirst,
	tableSelector,
}: UseColumnWidthProps): UseColumnWidthReturn => {
	const theme = useComputedColorScheme();

	const [headerWidthArray, setHeaderWidthArray_] = useState<number[]>(initialWidthArray);
	const headerWidthArrayRef = useRef(headerWidthArray);
	const [widthArray, setWidthArray] = useState<number[]>(initialWidthArray);

	const setHeaderWidthArray: typeof setHeaderWidthArray_ = (widthArray) => {
		if (typeof widthArray === "function") setWidthArray(widthArray(headerWidthArray));
		else {
			setHeaderWidthArray_(widthArray);
			headerWidthArrayRef.current = widthArray;
		}
	};

	const setAllWidthArray: typeof setHeaderWidthArray_ = (widthArray) => {
		setHeaderWidthArray(widthArray);
		setWidthArray(widthArray);
	};

	useEffect(
		() =>
			WriteSelectors("resize-handle-css", {
				".resize-handle": {
					cursor: "col-resize",
					userSelect: "none",

					zIndex: "1",
					position: "absolute",
					top: "0",
					right: "-1px",
					transform: "translateX(50%)",
					height: "100%",
					width: "27px",
				},

				"th:has(.resize-handle), td:has(.resize-handle)": {
					position: "relative",
				},
			}),
		[]
	);

	useEffect(
		() =>
			WriteSelectors(`table-column-widths-${tableSelector}-css`, {
				...Object.fromEntries(
					headerWidthArray.map((width, index) => [
						`${tableSelector} th:nth-child(${index + 1})`,
						{ width: `${width}px`, maxWidth: `${width}px` },
					])
				),
				...Object.fromEntries(
					widthArray.map((width, index) => [`${tableSelector} td:nth-child(${index + 1})`, { width: `${width}px` }])
				),
				[`${tableSelector}:not(.col-border) th:has(.resize-handle) + th`]: { borderLeft: "solid 1px transparent" },
				[`${tableSelector}:not(.col-border) thead:hover th:has(.resize-handle:not(.resizing)) + th,
					${tableSelector}:not(.col-border):has(.resizing) th:has(.resize-handle:not(.resizing)) + th`]: {
					borderLeft: theme === "light" ? "solid 1px black" : "solid 1px white",
				},
				[`${tableSelector}.resize-header-first:has(.resize-handle.resizing)`]: { display: "grid" },
			}),
		[headerWidthArray, tableSelector, theme, widthArray]
	);

	// TODO: implement double click behavior
	const onDoubleClick = () => {
		console.log("double click (not yet implemented)");
	};

	const ResizeHandle = useMemo(
		() =>
			isResizeHeaderFirst
				? ({ index }: { index: number }) => (
						<BaseResizeHandle
							index={index}
							width={headerWidthArrayRef.current[index]}
							setWidth={(width) => setHeaderWidthArray(headerWidthArrayRef.current.with(index, width))}
							onStartResize={() =>
								setWidthArray([
									...document
										.querySelectorAll(`${tableSelector} tbody tr:first-child td`)
										.values()
										.map((el) => el.getBoundingClientRect().width),
								])
							}
							onEndResize={() => setWidthArray(headerWidthArrayRef.current)}
							onDoubleClick={onDoubleClick}
							tableSelector={tableSelector}
						/>
				  )
				: ({ index }: { index: number }) => (
						<BaseResizeHandle
							index={index}
							width={headerWidthArrayRef.current[index]}
							setWidth={(width) => setAllWidthArray(headerWidthArrayRef.current.with(index, width))}
							onDoubleClick={onDoubleClick}
							tableSelector={tableSelector}
						/>
				  ),
		// eslint-disable-next-line react-hooks/exhaustive-deps
		[isResizeHeaderFirst, tableSelector]
	);

	return { widthArray: headerWidthArray, setWidthArray: setAllWidthArray, ResizeHandle };
};
