import { st } from "@/actions/actions.impl";
import { MANTINE_DARK_THEME, MANTINE_LIGHT_THEME, Table } from "@/utils/TableUtils/Table";
import { useReact } from "@/utils/useReact";
import type { TableVirtuosoProps } from "react-virtuoso";

export const getTableComponents = <T,>(): TableVirtuosoProps<T, unknown>["components"] => ({
	Table: ({ children, ...props }) => {
		const isDark = useReact(st.colorScheme.current) === "dark";
		return (
			<Table
				fullHeight
				withColumnBorders
				withRowBorders
				withTableBorder
				highlightOnHover
				stickyHeader
				stickyFooter
				tableProps={props}
				children={children}
				styleOptions={{
					...(isDark ? MANTINE_DARK_THEME : MANTINE_LIGHT_THEME),
					cellPadding: "1px 3px",
					stripedBackgroundColor: isDark ? "#2E2E2E" : "#F1F3F5",
					highlightBackgroundColor: isDark ? "#3B3B3B" : "#dbdee0",
				}}
				styles={{ tr: { height: "1px" }, other: { "tr:has(.empty-row)": { height: "auto" } } }}
			/>
		);
	},
	TableHead: ({ style: _, ...props }) => <thead {...props} />,
	TableRow: ({ item: _, ...props }) => <tr {...props} className={props["data-index"] % 2 === 0 ? "even-row" : ""} />,
	TableFoot: ({ style: _, ...props }) => <tfoot {...props} />,
});
