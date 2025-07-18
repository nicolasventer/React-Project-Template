import { api } from "@/api/api";
import type { UserFilterState, UserSortState } from "@/components/users/UsersManagers";
import { checkAndRefreshToken, setAppWithUpdate } from "@/globalState";
import type { MultiUserOutput } from "@/Shared/SharedModel";
import { toast } from "react-hot-toast";

const _updateUsersLoading = () =>
	setAppWithUpdate("updateUsersLoading", (prev) => {
		prev.users.isLoading = true;
	});

const _updateUsers = ({ users }: MultiUserOutput) =>
	setAppWithUpdate("updateUsers", (prev) => {
		prev.users.isLoading = false;
		prev.users.values = users;
	});

const _updateUsersError = (error: string) =>
	setAppWithUpdate("updateUsersError", [error], (prev) => {
		prev.users.error = error;
		prev.users.isLoading = false;
	});

const getUsers = async (token: string) => {
	const validToken = await checkAndRefreshToken(token);
	_updateUsersLoading();
	return api.v1.users
		.get({ headers: { "x-token": validToken } })
		.then(async ({ data, error }) => {
			if (data) _updateUsers(data);
			else {
				toast.error("Failed to get users");
				if (error.status === 401) _updateUsersError(error.value);
				else if (error.status === 422) _updateUsersError(error.value.summary ?? "Validation error");
				else throw error;
			}
		})
		.catch((error) => {
			_updateUsersError(typeof error === "object" && error && "message" in error ? (error.message as string) : "Unknown error");
		});
};

const updateSortState = (sortState: UserSortState) =>
	setAppWithUpdate("updateSortState", (prev) => {
		prev.users.sort = sortState;
	});

const updateFilterState = (filterState: UserFilterState) =>
	setAppWithUpdate("updateFilterState", (prev) => {
		prev.users.filter = filterState;
	});

const toggleSortAdditive = () =>
	setAppWithUpdate("toggleSortAdditive", (prev) => {
		prev.users.isSortAdditive = !prev.users.isSortAdditive;
	});

export const users = {
	get: getUsers,
	sortState: { update: updateSortState },
	filterState: { update: updateFilterState },
	sortAdditive: { toggle: toggleSortAdditive },
};
