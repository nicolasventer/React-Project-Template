import { actions } from "@/actions/actions.impl";
import { Users } from "@/components/users/Users";
import type { UserColumnKey } from "@/components/users/UsersManagers";
import { userColumnManager, userFilterManager, userSortManager } from "@/components/users/UsersManagers";
import { useApp } from "@/globalState";
import { ROLES } from "@/Shared/SharedModel";
import { uniqueSortObj } from "@/utils/clientUtils";
import { MANTINE_DARK_THEME, MANTINE_LIGHT_THEME } from "@/utils/TableUtils/Table";
import { useEffect, useMemo } from "react";

export const UsersPage = () => {
	const { users, auth, colorScheme, shell } = useApp();
	const token = auth.token.get();
	const isDark = colorScheme.value === "dark";

	useEffect(() => {
		if (token) actions.users.get(token);
	}, [token]);

	const filteredUsers = useMemo(() => userFilterManager.filterData(users.values, users.filter), [users.values, users.filter]);
	const sortedUsers = useMemo(() => userSortManager.sortData(filteredUsers, users.sort), [filteredUsers, users.sort]);

	const tableStyleOptions = useMemo(() => (isDark ? MANTINE_DARK_THEME : MANTINE_LIGHT_THEME), [isDark]);

	const columns = useMemo(() => userColumnManager.getVisibleColumnsValues(users.column), [users.column]);

	const options = useMemo(
		(): Record<UserColumnKey, string[]> =>
			uniqueSortObj({
				userId: users.values.map((user) => user.userId.toString()),
				email: users.values.map((user) => user.email),
				role: [...ROLES],
				// lastLoginTime: [min, max]
				lastLoginTime: users.values
					.reduce(
						(acc, user) => [Math.min(acc[0], user.lastLoginTime), Math.max(acc[1], user.lastLoginTime)],
						[Infinity, -Infinity]
					)
					.map((time) => time.toString()),
				actions: [],
			}),
		[users.values]
	);

	return (
		<Users
			users={users}
			token={token}
			isAboveMd={shell.isAboveMd}
			sortedUsers={sortedUsers}
			tableStyleOptions={tableStyleOptions}
			columns={columns}
			options={options}
		/>
	);
};
