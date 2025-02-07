import { WriteSelectors } from "@/utils/ComponentToolbox";
import { useComputedColorScheme } from "@mantine/core";
import clsx from "clsx";
import { type ComponentPropsWithRef, useEffect, useMemo } from "react";

/**
 * Get the selector for the table
 * @param cssId the css id used to set the class name of the table
 * @returns the selector for the table
 */
// eslint-disable-next-line react-refresh/only-export-components
export const getTableSelector = (cssId = "default") => `.table-${cssId}`;

/** The Table component props */
export type TableProps = {
	/** Whether to set the table to full width (default: true) */
	fullWidth?: boolean;
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
	styleOptions?: {
		/** The table border css (default: `0.0625rem solid ${theme === "light" ? "#DFE2E6" : "#424242"}`) */
		tableBorder?: string;
		/** The column border css (default: `0.0625rem solid ${theme === "light" ? "#DFE2E6" : "#424242"}`) */
		colBorder?: string;
		/** The row border css (default: `0.0625rem solid ${theme === "light" ? "#DFE2E6" : "#424242"}`) */
		rowBorder?: string;
		/** The striped background color (default: `theme === "light" ? "#F8F9FA" : "#2E2E2E"`) */
		stripedBackgroundColor?: string;
		/** The highlight background color (default: `theme === "light" ? "#F1F3F5" : "#3B3B3B"`) */
		highlightBackgroundColor?: string;
		/** The thead background color (default: `theme === "light" ? "#FFFFFF" : "#242424"`) */
		theadBackgroundColor?: string;
		/** The tfoot background color (default: `theme === "light" ? "#FFFFFF" : "#242424"`) */
		tfootBackgroundColor?: string;
	};
	/** The styles to apply to table elements (it is using the class name selector defined by the css id) */
	styles?: {
		/** The tr styles */
		tr?: Partial<CSSStyleDeclaration>;
		/** The th styles */
		th?: Partial<CSSStyleDeclaration>;
		/** The td styles */
		td?: Partial<CSSStyleDeclaration>;
		/** The table styles */
		table?: Partial<CSSStyleDeclaration>;
		/** The thead styles */
		thead?: Partial<CSSStyleDeclaration>;
		/** The tbody styles */
		tbody?: Partial<CSSStyleDeclaration>;
		/** The tfoot styles */
		tfoot?: Partial<CSSStyleDeclaration>;
		/** The other styles */
		other?: Record<string, Partial<CSSStyleDeclaration>>;
		/** The thead > tr styles */
		"thead > tr"?: Partial<CSSStyleDeclaration>;
		/** The thead > tr > th styles */
		"thead > tr > th"?: Partial<CSSStyleDeclaration>;
		/** The thead > tr > td styles */
		"thead > tr > td"?: Partial<CSSStyleDeclaration>;
		/** The tbody > tr styles */
		"tbody > tr"?: Partial<CSSStyleDeclaration>;
		/** The tbody > tr > th styles */
		"tbody > tr > th"?: Partial<CSSStyleDeclaration>;
		/** The tbody > tr > td styles */
		"tbody > tr > td"?: Partial<CSSStyleDeclaration>;
		/** The tfoot > tr styles */
		"tfoot > tr"?: Partial<CSSStyleDeclaration>;
		/** The tfoot > tr > th styles */
		"tfoot > tr > th"?: Partial<CSSStyleDeclaration>;
		/** The tfoot > tr > td styles */
		"tfoot > tr > td"?: Partial<CSSStyleDeclaration>;
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
	styleOptions,
	styles,
	tableProps,
	children,
}: TableProps) => {
	const theme = useComputedColorScheme();

	const {
		tableBorder = `0.0625rem solid ${theme === "light" ? "#DFE2E6" : "#424242"}`,
		colBorder = `0.0625rem solid ${theme === "light" ? "#DFE2E6" : "#424242"}`,
		rowBorder = `0.0625rem solid ${theme === "light" ? "#DFE2E6" : "#424242"}`,
		stripedBackgroundColor = theme === "light" ? "#F8F9FA" : "#2E2E2E",
		highlightBackgroundColor = theme === "light" ? "#F1F3F5" : "#3B3B3B",
		theadBackgroundColor = theme === "light" ? "#FFFFFF" : "#242424",
		tfootBackgroundColor = theme === "light" ? "#FFFFFF" : "#242424",
	} = styleOptions ?? {};

	const { other, ...mainStyles } = styles ?? {};

	useEffect(() => {
		if (bWriteCss) {
			const tableBackgroundColor = theme === "light" ? "#FFFFFF" : "#242424";
			const rowBorderColor = "#424242";
			const colBorderColor = "#424242";
			const tableSelector = getTableSelector(cssId);
			WriteSelectors(`table-${cssId}-css`, {
				[`${tableSelector}`]: { borderCollapse: "collapse", fontSize: "0.875rem" },
				[`${tableSelector}, ${tableSelector} *`]: { boxSizing: "border-box" },
				[`${tableSelector} th`]: { textAlign: "left" },
				[`${tableSelector} th *`]: { overflow: "hidden", whiteSpace: "nowrap", textOverflow: "ellipsis" },
				[`${tableSelector} th, ${tableSelector} td`]: { padding: "0.4375rem 0.625rem", backgroundColor: tableBackgroundColor },

				[`${tableSelector}.table-full-width`]: { minWidth: "100%" },
				[`${tableSelector}.table-border`]: { border: tableBorder },
				[`${tableSelector}.table-border > :first-child > tr:first-child,
					${tableSelector}.table-border > :last-child > tr:last-child`]: {
					// visible when table-border is set and not row-border
					boxShadow: `inset 0px 0px 0px 0.0625rem ${rowBorderColor}`,
				},
				[`${tableSelector}.col-border th, ${tableSelector}.col-border td`]: {
					borderLeft: colBorder,
					borderRight: colBorder,
					// visible when col-border is set and some columns are pinned
					boxShadow: `inset 0.0625rem 0px 0px 0px ${colBorderColor}`,
				},
				[`${tableSelector}.row-border tr`]: {
					borderTop: rowBorder,
					borderBottom: rowBorder,
					// visible when row-border is set and header or footer is sticky
					boxShadow: `inset 0px 0px 0px 0.0625rem ${rowBorderColor}`,
				},
				// visible when row-border is set and not table-border
				[`${tableSelector}.row-border > :first-child > tr:first-child`]: { borderTop: "none" },
				[`${tableSelector}.row-border > :last-child > tr:last-child`]: { borderBottom: "none" },
				// visible when col-border is set and not table-border
				[`${tableSelector}.col-border th:first-child,
					${tableSelector}.col-border td:first-child`]: { borderLeft: "none", boxShadow: "none" },
				[`${tableSelector}.col-border th:last-child, ${tableSelector}.col-border td:last-child`]: { borderRight: "none" },

				[`${tableSelector}.row-striped tbody > tr:nth-of-type(odd) > th,
					${tableSelector}.row-striped tbody > tr:nth-of-type(odd) > td`]: { backgroundColor: stripedBackgroundColor },
				[`${tableSelector}.row-highlightOnHover tbody > tr:hover > th,
					${tableSelector}.row-highlightOnHover tbody > tr:hover > td`]: { backgroundColor: highlightBackgroundColor },
				[`${tableSelector}.sticky-header thead`]: { position: "sticky", top: "0", zIndex: "3" },
				[`${tableSelector}.sticky-footer tfoot`]: { position: "sticky", bottom: "0", zIndex: "3" },
			});
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
		colBorder,
		cssId,
		highlightBackgroundColor,
		mainStyles,
		other,
		rowBorder,
		stripedBackgroundColor,
		tableBorder,
		tfootBackgroundColor,
		theadBackgroundColor,
		theme,
	]);

	const className = useMemo(
		() =>
			clsx(
				`table-${cssId}`,
				{
					"table-full-width": fullWidth,
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
