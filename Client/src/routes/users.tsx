import { actions } from "@/actions/actions.impl";
import { Users } from "@/components/users/Users";
import type { UserColumnKey } from "@/components/users/UsersManagers";
import { userColumnManager, userFilterManager, userSortManager } from "@/components/users/UsersManagers";
import { app } from "@/globalState";
import { ROLES } from "@/Shared/SharedModel";
import { uniqueSortObj } from "@/utils/clientUtils";
import { MANTINE_DARK_THEME, MANTINE_LIGHT_THEME } from "@/utils/TableUtils/Table";
import { useEffect, useMemo } from "react";

export const UsersPage = () => {
	const usersValues = app.users.values.use();
	const usersFilter = app.users.filter.use();
	const usersSort = app.users.sort.use();
	const usersColumn = app.users.column.use();
	const token = app.auth.token.use();
	const colorScheme = app.colorScheme.data.use();
	const isAboveMd = app.shell.isAboveMd.use();

	const isDark = colorScheme === "dark";

	useEffect(() => {
		if (token) actions.users.get(token);
	}, [token]);

	const filteredUsers = useMemo(() => userFilterManager.filterData(usersValues, usersFilter), [usersValues, usersFilter]);
	const sortedUsers = useMemo(() => userSortManager.sortData(filteredUsers, usersSort), [filteredUsers, usersSort]);

	const tableStyleOptions = useMemo(() => (isDark ? MANTINE_DARK_THEME : MANTINE_LIGHT_THEME), [isDark]);

	const columns = useMemo(() => userColumnManager.getVisibleColumnsValues(usersColumn), [usersColumn]);

	const options = useMemo(
		(): Record<UserColumnKey, string[]> =>
			uniqueSortObj({
				userId: usersValues.map((user) => user.userId.toString()),
				email: usersValues.map((user) => user.email),
				role: [...ROLES],
				// lastLoginTime: [min, max]
				lastLoginTime: usersValues
					.reduce(
						(acc, user) => [Math.min(acc[0], user.lastLoginTime), Math.max(acc[1], user.lastLoginTime)],
						[Infinity, -Infinity]
					)
					.map((time) => time.toString()),
				actions: [],
			}),
		[usersValues]
	);

	return (
		<Users
			usersValues={usersValues}
			usersFilter={usersFilter}
			usersSort={usersSort}
			token={token}
			isAboveMd={isAboveMd}
			sortedUsers={sortedUsers}
			tableStyleOptions={tableStyleOptions}
			columns={columns}
			options={options}
		/>
	);
};
