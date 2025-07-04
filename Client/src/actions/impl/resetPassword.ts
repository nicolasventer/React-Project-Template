import { api } from "@/api/api";
import { setAppWithUpdate } from "@/globalState";
import { HashedString } from "@/utils/Redux/HashedString";
import toast from "react-hot-toast";

const updateNewPassword = (newPassword: string) => {
	const hashedNewPassword = new HashedString(newPassword);
	setAppWithUpdate("updateNewPassword", [hashedNewPassword], (prev) => {
		prev.resetPassword.newPassword = hashedNewPassword;
	});
};

const _updateIsResetPasswordLoading = () => {
	setAppWithUpdate("updateIsResetPasswordLoading", (prev) => {
		prev.resetPassword.isLoading = true;
	});
};

const _updateResetPasswordError = (error: string) => {
	setAppWithUpdate("updateResetPasswordError", [error], (prev) => {
		prev.resetPassword.error = error;
		prev.resetPassword.isLoading = false;
	});
};

const _updateResetPasswordSuccess = () => {
	setAppWithUpdate("updateResetPasswordSuccess", [], (prev) => {
		prev.resetPassword.isLoading = false;
		prev.resetPassword.error = "";
	});
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
	setAppWithUpdate("updateInputToken", [inputToken], (prev) => {
		prev.resetPassword.inputToken = inputToken;
		prev.resetPassword.error = "";
	});
};

export const resetPassword = {
	newPassword: { update: updateNewPassword },
	password: { resetFn: resetPasswordFn },
	inputToken: { update: updateInputToken },
};
