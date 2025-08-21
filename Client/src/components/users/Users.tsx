import type { UserColumnKey, UserColumnValue } from "@/components/users/UsersManagers";
import type { AppState } from "@/globalState";
import { app } from "@/globalState";
import { Vertical } from "@/utils/ComponentToolbox";
import type { TableStyleOptions } from "@/utils/TableUtils/Table";
import { Table } from "@/utils/TableUtils/Table";
import { Alert, LoadingOverlay, Title } from "@mantine/core";

export const Users = ({
	usersValues,
	usersFilter,
	usersSort,
	token,
	isAboveMd,
	sortedUsers,
	tableStyleOptions,
	columns,
	options,
}: {
	usersValues: AppState["users"]["values"];
	usersFilter: AppState["users"]["filter"];
	usersSort: AppState["users"]["sort"];
	token: string;
	isAboveMd: boolean;
	sortedUsers: AppState["users"]["values"];
	tableStyleOptions: TableStyleOptions;
	columns: UserColumnValue[];
	options: Record<UserColumnKey, string[]>;
}) => {
	const usersError = app.users.error.use();
	const usersIsLoading = app.users.isLoading.use();
	const usersIsSortAdditive = app.users.isSortAdditive.use();
	const usersEditedValues = app.users.editedValues.use();

	return (
		<Vertical gap={16}>
			<Title>Users</Title>
			{usersError && (
				<Alert color="red" title="Error">
					{usersError}
				</Alert>
			)}
			{!token && (
				<Alert color="yellow" title="Authentication Required">
					Please log in to view users.
				</Alert>
			)}
			<div style={{ position: "relative" }}>
				<LoadingOverlay visible={usersIsLoading} />
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
									sortState={usersSort}
									filterState={usersFilter}
									isAboveMd={isAboveMd}
									isSortAdditive={usersIsSortAdditive}
									lastLoginTimeOptions={options.lastLoginTime}
								>
									<Column.filterRender options={options[Column.key]} filterState={usersFilter} />
								</Column.headerRender>
							))}
						</tr>
					</thead>
					<tbody>
						{sortedUsers.map((user) => (
							<tr key={user.userId}>
								{columns.map((Column) => (
									<td key={Column.key}>
										<Column.render user={user} editedUser={usersEditedValues[user.userId]} token={token} />
									</td>
								))}
							</tr>
						))}
						{sortedUsers.length === 0 && (
							<tr>
								<td colSpan={columns.length} style={{ textAlign: "center" }}>
									{usersValues.length === 0 ? "No users found" : "No users match the current filters"}
								</td>
							</tr>
						)}
					</tbody>
				</Table>
			</div>
		</Vertical>
	);
};
