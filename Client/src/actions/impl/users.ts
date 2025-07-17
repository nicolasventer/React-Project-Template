import { api } from "@/api/api";
import type { UserFilterState, UserSortState } from "@/components/users/UsersManagers";
import { refreshToken, setAppWithUpdate } from "@/globalState";
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

const getUsers = (token: string): Promise<void> => {
	_updateUsersLoading();
	return api.v1.users
		.get({ headers: { "x-token": token } })
		.then(({ data, error }) => {
			if (error?.status === 401 && error.value === "Token expired") return refreshToken(getUsers, token);
			if (data) _updateUsers(data);
			else {
				toast.error("Failed to get users");
				if (error.status === 422) _updateUsersError(error.value.summary ?? "Validation error");
				else throw error;
			}
		})
		.catch((error) => {
			_updateUsersError(typeof error === "object" && error && "message" in error ? (error.message as string) : "Unknown error");
		});
};

const setSortState = (sortState: UserSortState) =>
	setAppWithUpdate("setSortState", (prev) => {
		prev.users.sort = sortState;
	});

const setFilterState = (filterState: UserFilterState) =>
	setAppWithUpdate("setFilterState", (prev) => {
		prev.users.filter = filterState;
	});

const toggleSortAdditive = () =>
	setAppWithUpdate("toggleSortAdditive", (prev) => {
		prev.users.isSortAdditive = !prev.users.isSortAdditive;
	});

export const users = {
	get: getUsers,
	setSortState,
	setFilterState,
	toggleSortAdditive,
};
