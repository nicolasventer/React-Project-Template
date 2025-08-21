import { api } from "@/api/api";
import { app, checkAndRefreshToken } from "@/globalState";
import toast from "react-hot-toast";

const updateNewPassword = (password: string) => {
	app.profile.newPassword.setValue(password);
	app.profile.error.setValue("");
};

const updateConfirmNewPassword = (password: string) => {
	app.profile.confirmNewPassword.setValue(password);
	app.profile.error.setValue("");
};

const _updateProfileIsLoading = () => {
	app.profile.isLoading.setValue(true);
	app.profile.error.setValue("");
};

const _updateProfileError = (error: string) => {
	app.profile.error.setValue(error);
	app.profile.isLoading.setValue(false);
};

const _updateProfileSuccess = () => {
	app.profile.newPassword.setValue("");
	app.profile.confirmNewPassword.setValue("");
	app.profile.isLoading.setValue(false);
	app.profile.error.setValue("");
};

const confirmPasswordFn = (newPassword: string, confirmNewPassword: string, token: string) => async () => {
	if (newPassword !== confirmNewPassword) {
		_updateProfileError("Passwords do not match");
		return;
	}
	const validToken = await checkAndRefreshToken(token);
	_updateProfileIsLoading();
	return api.v1.users.current
		.patch({ password: newPassword }, { headers: { "x-token": validToken } })
		.then(async ({ data, error }) => {
			if (data) {
				toast.success("Password updated successfully");
				_updateProfileSuccess();
			} else {
				toast.error("Failed to update password");
				if (error.status === 401) _updateProfileError(error.value);
				else if (error.status === 404) _updateProfileError("User not found");
				else if (error.status === 422) _updateProfileError(error.value.summary ?? "Validation error");
				else throw error;
			}
		})
		.catch((error) =>
			_updateProfileError(typeof error === "object" && error && "message" in error ? (error.message as string) : "Unknown error")
		);
};

const pressDeleteAccountButton = () => app.profile.deleteAccount.buttonPressedAt.setValue(Date.now());

const cancelPressDeleteAccountButton = () => app.profile.deleteAccount.buttonPressedAt.setValue(null);

const _updateDeleteAccountSuccess = () => {
	app.profile.deleteAccount.buttonPressedAt.setValue(null);
	app.profile.isLoading.setValue(false);
	app.profile.error.setValue("");
	app.auth.token.setValue("");
};

const _updateDeleteAccountError = (error: string) => {
	app.profile.error.setValue(error);
	app.profile.isLoading.setValue(false);
};

const deleteAccountFn = (token: string) => async () => {
	const validToken = await checkAndRefreshToken(token);
	_updateProfileIsLoading();
	return api.v1.users.current
		.delete({}, { headers: { "x-token": validToken } })
		.then(async ({ data, error }) => {
			if (data) {
				toast.success("Account deleted successfully");
				_updateDeleteAccountSuccess();
			} else {
				toast.error("Failed to delete account");
				if (error.status === 401) _updateDeleteAccountError(error.value);
				else if (error.status === 404) _updateDeleteAccountError("User not found");
				else if (error.status === 422) _updateDeleteAccountError(error.value.summary ?? "Validation error");
				else throw error;
			}
		})
		.catch((error) =>
			_updateDeleteAccountError(
				typeof error === "object" && error && "message" in error ? (error.message as string) : "Unknown error"
			)
		);
};

export const profile = {
	newPassword: { update: updateNewPassword },
	confirmNewPassword: { update: updateConfirmNewPassword },
	password: { confirmFn: confirmPasswordFn },
	deleteAccount: {
		pressButton: pressDeleteAccountButton,
		cancelButton: cancelPressDeleteAccountButton,
		executeFn: deleteAccountFn,
	},
};
