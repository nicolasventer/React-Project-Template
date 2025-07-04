import type { UserColumnKey, UserColumnValue } from "@/components/users/UsersManagers";
import type { AppState } from "@/globalState";
import { Vertical } from "@/utils/ComponentToolbox";
import type { TableStyleOptions } from "@/utils/TableUtils/Table";
import { Table } from "@/utils/TableUtils/Table";
import { Alert, LoadingOverlay, Title } from "@mantine/core";

export const Users = ({
	users,
	token,
	isAboveMd,
	sortedUsers,
	tableStyleOptions,
	columns,
	options,
}: {
	users: AppState["users"];
	token: string;
	isAboveMd: boolean;
	sortedUsers: AppState["users"]["values"];
	tableStyleOptions: TableStyleOptions;
	columns: UserColumnValue[];
	options: Record<UserColumnKey, string[]>;
}) => (
	<Vertical gap={16}>
		<Title>Users</Title>
		{users.error && (
			<Alert color="red" title="Error">
				{users.error}
			</Alert>
		)}
		{!token && (
			<Alert color="yellow" title="Authentication Required">
				Please log in to view users.
			</Alert>
		)}
		<div style={{ position: "relative" }}>
			<LoadingOverlay visible={users.isLoading} />
			<Table
				fullWidth
				withTableBorder
				withColumnBorders
				withRowBorders
				striped
				highlightOnHover
				stickyHeader
				styleOptions={tableStyleOptions}
			>
				<thead>
					<tr>
						{columns.map((Column) => (
							<Column.headerRender
								key={Column.key}
								sortState={users.sort}
								filterState={users.filter}
								isAboveMd={isAboveMd}
								isSortAdditive={users.isSortAdditive}
								lastLoginTimeOptions={options.lastLoginTime}
							>
								<Column.filterRender options={options[Column.key]} filterState={users.filter} />
							</Column.headerRender>
						))}
					</tr>
				</thead>
				<tbody>
					{sortedUsers.map((user) => (
						<tr key={user.userId}>
							{columns.map((Column) => (
								<td key={Column.key}>
									<Column.render user={user} editedUser={users.editedValues[user.userId]} token={token} />
								</td>
							))}
						</tr>
					))}
					{sortedUsers.length === 0 && (
						<tr>
							<td colSpan={columns.length} style={{ textAlign: "center" }}>
								{users.values.length === 0 ? "No users found" : "No users match the current filters"}
							</td>
						</tr>
					)}
				</tbody>
			</Table>
		</div>
	</Vertical>
);
