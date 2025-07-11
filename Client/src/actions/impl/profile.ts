import { api } from "@/api/api";
import { setAppWithUpdate } from "@/globalState";
import { HashedString } from "@/utils/Redux/HashedString";
import toast from "react-hot-toast";

const updateNewPassword = (password: string) => {
	const hashedPassword = new HashedString(password);
	setAppWithUpdate("updateNewPassword", [hashedPassword], (prev) => {
		prev.profile.newPassword = hashedPassword;
		prev.profile.error = "";
	});
};

const updateConfirmNewPassword = (password: string) => {
	const hashedPassword = new HashedString(password);
	setAppWithUpdate("updateConfirmNewPassword", [hashedPassword], (prev) => {
		prev.profile.confirmNewPassword = hashedPassword;
		prev.profile.error = "";
	});
};

const _updateProfileIsLoading = () =>
	setAppWithUpdate("updateProfileIsLoading", [], (prev) => {
		prev.profile.isLoading = true;
		prev.profile.error = "";
	});

const _updateProfileError = (error: string) =>
	setAppWithUpdate("updateProfileError", [error], (prev) => {
		prev.profile.error = error;
		prev.profile.isLoading = false;
	});

const _updateProfileSuccess = () =>
	setAppWithUpdate("updateProfileSuccess", [], (prev) => {
		prev.profile.newPassword = new HashedString("");
		prev.profile.confirmNewPassword = new HashedString("");
		prev.profile.isLoading = false;
		prev.profile.error = "";
	});

const confirmPasswordFn = (newPassword: string, confirmNewPassword: string, token: string) => () => {
	if (newPassword !== confirmNewPassword) {
		_updateProfileError("Passwords do not match");
		return;
	}

	_updateProfileIsLoading();

	return api.v1.users.current
		.patch({ password: newPassword }, { headers: { "x-token": token } })
		.then(({ data, error }) => {
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

export const profile = {
	newPassword: { update: updateNewPassword },
	confirmNewPassword: { update: updateConfirmNewPassword },
	confirmPasswordFn,
};
