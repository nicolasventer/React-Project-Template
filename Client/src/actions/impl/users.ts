import type { ExampleUser } from "@/Shared/SharedModel";
import { handlePromise, setAppWithUpdate } from "@/globalState";

const updateUsersAll = (promiseUsers: Promise<ExampleUser[]>) =>
	handlePromise(promiseUsers, {
		functionName: "updateUsersAll",
		onUpdateLoading: (prev, isLoading) => (prev.users.isLoading = isLoading),
		onSuccess: (prev, users) => (prev.users.all = users.map((user) => ({ current: user, edit: null }))),
	});

const updateUsersFilter = (filter: string) =>
	setAppWithUpdate("updateUsersFilter", [filter], (prev) => (prev.users.filter = filter));
const startEditUserFn = (index: number) => () =>
	setAppWithUpdate("startEditUser", [index], (prev) => (prev.users.all[index].edit = { ...prev.users.all[index].current }));
const cancelEditUserFn = (index: number) => () =>
	setAppWithUpdate("cancelEditUser", [index], (prev) => (prev.users.all[index].edit = null));
const saveUserFn = (index: number) => () =>
	setAppWithUpdate("saveUser", [index], (prev) => {
		prev.users.all[index].current = prev.users.all[index].edit ?? prev.users.all[index].current;
		prev.users.all[index].edit = null;
	});
const addUser = () =>
	setAppWithUpdate("addUser", (prev) =>
		prev.users.all.unshift({ current: { name: "", email: "", permissions: [] }, edit: { name: "", email: "", permissions: [] } })
	);
const deleteUserFn = (index: number) => () => setAppWithUpdate("deleteUser", [index], (prev) => prev.users.all.splice(index, 1));
const updateEditUserNameFn = (index: number) => (name: string) =>
	setAppWithUpdate("updateEditUserName", [index, name], (prev) => (prev.users.all[index].edit!.name = name));
const updateEditUserEmailFn = (index: number) => (email: string) =>
	setAppWithUpdate("updateEditUserEmail", [index, email], (prev) => (prev.users.all[index].edit!.email = email));
const updateEditUserPermissionsFn = (index: number) => (permissions: string[]) =>
	setAppWithUpdate(
		"updateEditUserPermissions",
		[index, permissions],
		(prev) => (prev.users.all[index].edit!.permissions = permissions as ExampleUser["permissions"])
	);

export const users = {
	all: { update: updateUsersAll },
	filter: { update: updateUsersFilter },
	edit: {
		startFn: startEditUserFn,
		cancelFn: cancelEditUserFn,
		saveFn: saveUserFn,
		name: { updateFn: updateEditUserNameFn },
		email: { updateFn: updateEditUserEmailFn },
		permissions: { updateFn: updateEditUserPermissionsFn },
	},
	add: addUser,
	deleteFn: deleteUserFn,
};
