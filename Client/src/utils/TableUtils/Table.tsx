import type { CustomCSSStyleDeclaration } from "@/utils/ComponentToolbox";
import { WriteSelectors } from "@/utils/ComponentToolbox";
import clsx from "clsx";
import { type ComponentPropsWithRef, useEffect, useMemo } from "react";

/**
 * Get the selector for the table
 * @param cssId the css id used to set the class name of the table (default: "default")
 * @returns the selector for the table
 */
// eslint-disable-next-line react-refresh/only-export-components
export const getTableSelector = (cssId = "default") => `.table-${cssId}`;

/**
 * Get the exclude class for the table. Add this class to the element that you want to not apply the table styles to.
 * @param cssId the css id used to set the class name of the table (default: "default")
 * @returns the exclude class for the table
 */
// eslint-disable-next-line react-refresh/only-export-components
export const getTableExcludeClass = (cssId = "default") => `table-${cssId}-exclude`;

/** The class name to add to a row or a cell to not apply the highlight on hover */
export const NO_HIGHLIGHT_ON_HOVER_CLASS = "no-highlight-on-hover";

/** The table style options that customize all the table features like striped or highlightOnHover */
export type TableStyleOptions = {
	/** The table border color */
	borderColor:
		| string
		| {
				/** The table border color */
				table: string;
				/** The column border color */
				col: string;
				/** The row border color */
				row: string;
		  };
	/** The table border width */
	borderWidth:
		| string
		| {
				/** The table border width */
				table: string;
				/** The column border width */
				col: string;
				/** The row border width */
				row: string;
		  };
	/** The table background color */
	tableBackgroundColor: string;
	/** The striped background color */
	stripedBackgroundColor: string;
	/** The highlight background color */
	highlightBackgroundColor: string;
	/** The cell padding */
	cellPadding:
		| string
		| {
				/** The cell padding x */
				x: string;
				/** The cell padding y */
				y: string;
		  };
};

/** The Table component props */
export type TableProps = {
	/** Whether to set the table to full width (default: true) */
	fullWidth?: boolean;
	/** Whether to set the table to full height */
	fullHeight?: boolean;
	/** Whether to set the table to have a border */
	withTableBorder?: boolean;
	/** Whether to set the table to have column borders */
	withColumnBorders?: boolean;
	/** Whether to set the table to have row borders */
	withRowBorders?: boolean;
	/** Whether to set the table to have striped rows */
	striped?: boolean;
	/** Whether to set the table to have highlight on hover */
	highlightOnHover?: boolean;
	/** Whether to set the table to have sticky header */
	stickyHeader?: boolean;
	/** Whether to set the table to have sticky footer */
	stickyFooter?: boolean;
	/** Whether to set the table to have resize header first */
	isResizeHeaderFirst?: boolean;
	/** The css id used to set the class name of the table (default: "default") */
	cssId?: string;
	/** Whether to write the css (default: true) (set to false if you want to overwrite the css for the specified css id) */
	bWriteCss?: boolean;
	/** The style options that customize all the table features like striped or highlightOnHover */
	styleOptions: TableStyleOptions;
	/** The styles to apply to table elements (it is using the class name selector defined by the css id) */
	styles?: {
		/** The tr styles */
		tr?: Partial<CustomCSSStyleDeclaration>;
		/** The th styles */
		th?: Partial<CustomCSSStyleDeclaration>;
		/** The td styles */
		td?: Partial<CustomCSSStyleDeclaration>;
		/** The table styles */
		table?: Partial<CustomCSSStyleDeclaration>;
		/** The thead styles */
		thead?: Partial<CustomCSSStyleDeclaration>;
		/** The tbody styles */
		tbody?: Partial<CustomCSSStyleDeclaration>;
		/** The tfoot styles */
		tfoot?: Partial<CustomCSSStyleDeclaration>;
		/** The other styles */
		other?: Record<string, Partial<CustomCSSStyleDeclaration>>;
		/** The thead > tr styles */
		"thead > tr"?: Partial<CustomCSSStyleDeclaration>;
		/** The thead > tr > th styles */
		"thead > tr > th"?: Partial<CustomCSSStyleDeclaration>;
		/** The thead > tr > td styles */
		"thead > tr > td"?: Partial<CustomCSSStyleDeclaration>;
		/** The tbody > tr styles */
		"tbody > tr"?: Partial<CustomCSSStyleDeclaration>;
		/** The tbody > tr > th styles */
		"tbody > tr > th"?: Partial<CustomCSSStyleDeclaration>;
		/** The tbody > tr > td styles */
		"tbody > tr > td"?: Partial<CustomCSSStyleDeclaration>;
		/** The tfoot > tr styles */
		"tfoot > tr"?: Partial<CustomCSSStyleDeclaration>;
		/** The tfoot > tr > th styles */
		"tfoot > tr > th"?: Partial<CustomCSSStyleDeclaration>;
		/** The tfoot > tr > td styles */
		"tfoot > tr > td"?: Partial<CustomCSSStyleDeclaration>;
	};
	/** The <table> props */
	tableProps?: Omit<ComponentPropsWithRef<"table">, "children">;
	/** The <table> children */
	children?: ComponentPropsWithRef<"table">["children"];
};

/**
 * The table component
 * @param props
 * @param {boolean} [props.fullWidth=true] whether to set the table to full width (default: true)
 * @param props.withTableBorder whether to set the table to have a border
 * @param props.withColumnBorders whether to set the table to have column borders
 * @param props.withRowBorders whether to set the table to have row borders
 * @param props.striped whether to set the table to have striped rows
 * @param props.highlightOnHover whether to set the table to have highlight on hover
 * @param props.stickyHeader whether to set the table to have sticky header
 * @param props.stickyFooter whether to set the table to have sticky footer
 * @param props.isResizeHeaderFirst whether to set the table to have resize header first
 * @param {string} [props.cssId="default"] the css id used to set the class name of the table (default: "default")
 * @param {boolean} [props.bWriteCss=true] whether to write the css (default: true) (set to false if you want to overwrite the css for the specified css id)
 * @param props.styleOptions the style options that customize all the table features like striped or highlightOnHover
 * @param props.styles the styles to apply to table elements (it is using the class name selector defined by the css id)
 * @param props.tableProps the <table> props
 * @param props.children the <table> children
 */
export const Table = ({
	fullWidth = true,
	fullHeight,
	withTableBorder,
	withColumnBorders,
	withRowBorders,
	striped,
	highlightOnHover,
	stickyHeader,
	stickyFooter,
	isResizeHeaderFirst,
	cssId = "default",
	bWriteCss = true,
	styleOptions: {
		borderColor: borderColor_,
		borderWidth: borderWidth_,
		tableBackgroundColor,
		stripedBackgroundColor,
		highlightBackgroundColor,
		cellPadding: cellPadding_,
	},
	styles,
	tableProps,
	children,
}: TableProps) => {
	const { other, ...mainStyles } = styles ?? {};

	const borderColor =
		typeof borderColor_ === "string" ? { table: borderColor_, col: borderColor_, row: borderColor_ } : borderColor_;
	const borderWidth =
		typeof borderWidth_ === "string" ? { table: borderWidth_, col: borderWidth_, row: borderWidth_ } : borderWidth_;
	const cellPadding = typeof cellPadding_ === "string" ? cellPadding_ : `${cellPadding_.x} ${cellPadding_.y}`;

	const tableBorder = `${borderWidth.table} solid ${borderColor.table}`;
	const colBorder = `${borderWidth.col} solid ${borderColor.col}`;
	const rowBorder = `${borderWidth.row} solid ${borderColor.row}`;

	useEffect(() => {
		if (bWriteCss) {
			// const rowBorderColor = "#424242";
			// const colBorderColor = "#424242";
			const tableSelector = getTableSelector(cssId);
			WriteSelectors(
				`table-${cssId}-css`,
				{
					[`${tableSelector}`]: { borderCollapse: "separate", fontSize: "0.875rem" },
					[`${tableSelector}, ${tableSelector} *`]: { boxSizing: "border-box" },
					[`${tableSelector} th`]: { textAlign: "left" },
					[`${tableSelector} th *`]: { overflow: "hidden", whiteSpace: "nowrap", textOverflow: "ellipsis" },
					[`${tableSelector} th, ${tableSelector} td`]: { padding: cellPadding, backgroundColor: tableBackgroundColor },

					[`${tableSelector}.table-full-width`]: { minWidth: "100%" },
					[`${tableSelector}.table-full-height`]: { height: "100%" },
					[`${tableSelector}.table-border`]: { border: tableBorder },
					// [`${tableSelector}.table-border > :first-child > tr:first-child,
					// ${tableSelector}.table-border > :last-child > tr:last-child`]: {
					// 	// visible when table-border is set and not row-border
					// 	boxShadow: `inset 0px 0px 0px 0.0625rem ${rowBorderColor}`,
					// },
					[`${tableSelector}.col-border th, ${tableSelector}.col-border td`]: {
						borderLeft: colBorder,
						// borderRight: colBorder,
						// visible when col-border is set and some columns are pinned
						// boxShadow: `inset 0.0625rem 0px 0px 0px ${colBorderColor}`,
					},
					[`${tableSelector}.row-border tr`]: {
						borderTop: rowBorder,
						borderBottom: rowBorder,
						// visible when row-border is set and header or footer is sticky
						// boxShadow: `inset 0px 0px 0px 0.0625rem ${rowBorderColor}`,
					},
					// visible when row-border is set and not table-border
					[`${tableSelector}.row-border:not(.table-border) > :first-child > tr:first-child`]: { borderTop: "none" },
					[`${tableSelector}.row-border:not(.table-border) > :last-child > tr:last-child`]: { borderBottom: "none" },
					// visible when col-border is set and not table-border
					[`${tableSelector}.col-border:not(.table-border) th:first-child,
					${tableSelector}.col-border:not(.table-border) td:first-child`]: { borderLeft: "none", boxShadow: "none" },
					[`${tableSelector}.col-border:not(.table-border) th:last-child, ${tableSelector}.col-border:not(.table-border) td:last-child`]:
						{ borderRight: "none" },

					[`${tableSelector}.row-striped tbody > tr:nth-of-type(odd) > th,
					${tableSelector}.row-striped tbody > tr:nth-of-type(odd) > td`]: { backgroundColor: stripedBackgroundColor },
					[`${tableSelector}.row-highlightOnHover tbody > tr:hover:not(.${NO_HIGHLIGHT_ON_HOVER_CLASS}) > th:not(.${NO_HIGHLIGHT_ON_HOVER_CLASS}),
					${tableSelector}.row-highlightOnHover tbody > tr:hover:not(.${NO_HIGHLIGHT_ON_HOVER_CLASS}) > td:not(.${NO_HIGHLIGHT_ON_HOVER_CLASS})`]:
						{ backgroundColor: highlightBackgroundColor },
					[`${tableSelector}.sticky-header thead`]: { position: "sticky", top: "0", zIndex: "260" },
					[`${tableSelector}.sticky-footer tfoot`]: { position: "sticky", bottom: "0", zIndex: "260" },
				},
				`.${getTableExcludeClass(cssId)}`
			);
			WriteSelectors(`table-${cssId}-custom-css`, {
				...Object.fromEntries(
					Object.entries({ ...mainStyles, ...other }).map(([key, value]) => [
						`${tableSelector} ${key.replace(/^table/, "")}`,
						value,
					])
				),
			});
		}
	}, [
		bWriteCss,
		cellPadding,
		colBorder,
		cssId,
		highlightBackgroundColor,
		mainStyles,
		other,
		rowBorder,
		stripedBackgroundColor,
		tableBackgroundColor,
		tableBorder,
	]);

	const className = useMemo(
		() =>
			clsx(
				`table-${cssId}`,
				{
					"table-full-width": fullWidth,
					"table-full-height": fullHeight,
					"table-border": withTableBorder,
					"col-border": withColumnBorders,
					"row-border": withRowBorders,
					"row-striped": striped,
					"row-highlightOnHover": highlightOnHover,
					"resize-header-first": isResizeHeaderFirst,
					"sticky-header": stickyHeader,
					"sticky-footer": stickyFooter,
				},
				tableProps?.className
			),
		[
			cssId,
			fullWidth,
			fullHeight,
			withTableBorder,
			withColumnBorders,
			withRowBorders,
			striped,
			highlightOnHover,
			isResizeHeaderFirst,
			stickyHeader,
			stickyFooter,
			tableProps?.className,
		]
	);

	return (
		<table {...tableProps} className={className}>
			{children}
		</table>
	);
};

/** The mantine light theme */
// eslint-disable-next-line react-refresh/only-export-components
export const MANTINE_LIGHT_THEME: TableStyleOptions = {
	borderColor: "#DFE2E6",
	borderWidth: "0.0625rem",
	tableBackgroundColor: "#FFFFFF",
	stripedBackgroundColor: "#F8F9FA",
	highlightBackgroundColor: "#F1F3F5",
	cellPadding: "0.4375rem 0.625rem",
};

/** The mantine dark theme */
// eslint-disable-next-line react-refresh/only-export-components
export const MANTINE_DARK_THEME: TableStyleOptions = {
	...MANTINE_LIGHT_THEME,
	borderColor: "#424242",
	tableBackgroundColor: "#242424",
	stripedBackgroundColor: "#2E2E2E",
	highlightBackgroundColor: "#3B3B3B",
};
