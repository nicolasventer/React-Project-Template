import { api } from "@/api/api";
// eslint-disable-next-line project-structure/independent-modules
import type { UserFilterState, UserSortState } from "@/components/users/UsersManagers";
import { app, checkAndRefreshToken } from "@/globalState";
import type { MultiUserOutput, RoleType, UserOutput } from "@/Shared/SharedModel";
import { toast } from "react-hot-toast";

const _updateUsersLoading = () => app.users.isLoading.setValue(true);

const _updateUsers = ({ users }: MultiUserOutput) => {
	app.users.isLoading.setValue(false);
	app.users.values.setValue(users);
};

const _updateUsersError = (error: string) => {
	app.users.error.setValue(error);
	app.users.isLoading.setValue(false);
};

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

const updateSortState = (sortState: UserSortState) => app.users.sort.setValue(sortState);

const updateFilterState = (filterState: UserFilterState) => app.users.filter.setValue(filterState);

const toggleSortAdditive = () => app.users.isSortAdditive.setValue((value) => !value);

const updateEditedUserRole = (user: UserOutput, role: RoleType) => {
	if (user.role === role) app.users.editedValues.setValue((prev) => ({ ...prev, [user.userId]: null }));
	else app.users.editedValues.setValue((prev) => ({ ...prev, [user.userId]: { ...user, role } }));
};

const saveEditedUserFn = (token: string, editedValue: UserOutput) => async () => {
	const validToken = await checkAndRefreshToken(token);
	_updateUsersLoading();
	return api.v1
		.users({ id: editedValue.userId })
		.patch({ role: editedValue.role }, { headers: { "x-token": validToken } })
		.then(async ({ data, error }) => {
			if (data) {
				app.users.values.setValue((prev) => prev.map((user) => (user.userId === editedValue.userId ? editedValue : user)));
				app.users.editedValues.setValue((prev) => ({ ...prev, [editedValue.userId]: null }));
				app.users.isLoading.setValue(false);
				toast.success("Role updated");
			} else {
				toast.error("Failed to update role");
				if (error.status === 401) _updateUsersError(error.value);
				else if (error.status === 422) _updateUsersError(error.value.summary ?? "Validation error");
				else throw error;
			}
		})
		.catch((error) => {
			_updateUsersError(typeof error === "object" && error && "message" in error ? (error.message as string) : "Unknown error");
		});
};

const cancelEditedUserFn = (userId: number) => () => app.users.editedValues.setValue((prev) => ({ ...prev, [userId]: null }));

export const users = {
	get: getUsers,
	sortState: { update: updateSortState },
	filterState: { update: updateFilterState },
	sortAdditive: { toggle: toggleSortAdditive },
	edited: {
		role: { update: updateEditedUserRole },
		saveFn: saveEditedUserFn,
		cancelFn: cancelEditedUserFn,
	},
};
