import { api } from "@/api/api";
import { app, type LoginViewType } from "@/globalState";
import type { RoleType } from "@/Shared/SharedModel";
import toast from "react-hot-toast";

const updateEmail = (email: string) => {
	app.auth.user.email.setValue(email);
	app.auth.error.setValue("");
};

const updatePassword = (password: string) => {
	app.auth.user.password.setValue(password);
	app.auth.error.setValue("");
};

const updateIsModalOpenedFn = (isModalOpened: boolean) => () => app.auth.isModalOpened.setValue(isModalOpened);

const updateLoginViewFn = (loginView: LoginViewType) => () =>
	void document.startViewTransition(() => app.auth.loginView.setValue(loginView));

const _updateLoginIsLoading = () => app.auth.isLoading.setValue(true);

const _updateTokenAndRole = (token: string, role: RoleType) => {
	app.auth.token.setValue(token);
	app.auth.user.role.setValue(role);
	app.auth.isLoading.setValue(false);
	app.auth.error.setValue("");
	app.auth.isModalOpened.setValue(false);
};

const _updateLoginError = (error: string) => {
	app.auth.isLoading.setValue(false);
	app.auth.error.setValue(error);
};

const loginFn = (email: string, password: string) => () => {
	_updateLoginIsLoading();
	return api.v1.auth.login
		.post({ email, password })
		.then(({ data, error }) => {
			if (data) {
				toast.success("Logged in successfully");
				_updateTokenAndRole(data.token, data.role);
			} else {
				toast.error("Failed to login");
				if (error.status === 401) _updateLoginError(error.value);
				else if (error.status === 422) _updateLoginError(error.value.summary ?? "Validation error");
				else throw error;
			}
		})
		.catch((error) =>
			_updateLoginError(typeof error === "object" && error && "message" in error ? (error.message as string) : "Unknown error")
		);
};

const createAccountFn = (email: string, password: string) => () => {
	_updateLoginIsLoading();
	return api.v1.users
		.post({ email, password })
		.then(({ data, error }) => {
			if (data) {
				toast.success("Account created successfully");
				return loginFn(email, password)();
			} else {
				toast.error("Failed to create account");
				if (error.status === 422) _updateLoginError(error.value.summary ?? "Validation error");
				else throw error;
			}
		})
		.catch((error) =>
			_updateLoginError(typeof error === "object" && error && "message" in error ? (error.message as string) : "Unknown error")
		);
};

const _updateResetPasswordView = () => {
	app.auth.loginView.setValue("Login");
	app.auth.isLoading.setValue(false);
};

const resetPasswordFn = (email: string) => () => {
	_updateLoginIsLoading();
	return api.v1.password["request-reset"]
		.post({ email })
		.then(({ data, error }) => {
			_updateResetPasswordView();
			if (data) {
				if (typeof data === "object") window.open(data.link, "_blank");
				else toast.success("Reset password link sent");
			} else if (error.status === 422) _updateLoginError(error.value.summary ?? "Validation error");
			else _updateLoginError(error.value);
		})
		.catch((error) =>
			_updateLoginError(typeof error === "object" && error && "message" in error ? (error.message as string) : "Unknown error")
		);
};

const logout = () => {
	app.auth.token.setValue("");
	app.auth.user.role.setValue(null);
};

export const auth = {
	email: { update: updateEmail },
	password: { update: updatePassword, resetFn: resetPasswordFn },
	isModalOpened: { updateFn: updateIsModalOpenedFn },
	loginView: { updateFn: updateLoginViewFn },
	loginFn: loginFn,
	account: { createFn: createAccountFn },
	logout: logout,
};
