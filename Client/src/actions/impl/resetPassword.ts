import { api } from "@/api/api";
import { app } from "@/globalState";
import toast from "react-hot-toast";

const updateNewPassword = (newPassword: string) => app.resetPassword.newPassword.setValue(newPassword);

const _updateIsResetPasswordLoading = () => app.resetPassword.isLoading.setValue(true);

const _updateResetPasswordError = (error: string) => {
	app.resetPassword.error.setValue(error);
	app.resetPassword.isLoading.setValue(false);
};

const _updateResetPasswordSuccess = () => {
	app.resetPassword.isLoading.setValue(false);
	app.resetPassword.error.setValue("");
};

const resetPasswordFn = (token: string, newPassword: string) => () => {
	_updateIsResetPasswordLoading();
	api.v1.password.reset
		.put({ password: newPassword }, { query: { token } })
		.then(({ data, error }) => {
			if (data) {
				toast.success("Password reset successfully");
				_updateResetPasswordSuccess();
			}
			if (error) {
				if (error.status === 401) _updateResetPasswordError(error.value);
				else if (error.status === 404) _updateResetPasswordError("User not found");
				else if (error.status === 422) _updateResetPasswordError(error.value.summary ?? "Validation error");
				else throw error;
			}
		})
		.catch((error) =>
			_updateResetPasswordError(
				typeof error === "object" && error && "message" in error ? (error.message as string) : "Unknown error"
			)
		);
};

const updateInputToken = (inputToken: string) => {
	app.resetPassword.inputToken.setValue(inputToken);
	app.resetPassword.error.setValue("");
};

export const resetPassword = {
	newPassword: { update: updateNewPassword },
	password: { resetFn: resetPasswordFn },
	inputToken: { update: updateInputToken },
};
