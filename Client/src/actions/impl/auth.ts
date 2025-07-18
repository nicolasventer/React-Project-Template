import { api } from "@/api/api";
import type { LoginViewType } from "@/globalState";
import { setAppWithUpdate } from "@/globalState";
import type { RoleType } from "@/Shared/SharedModel";
import { HashedString } from "@/utils/Redux/HashedString";
import toast from "react-hot-toast";

const updateEmail = (email: string) =>
	setAppWithUpdate("updateEmail", [email], (prev) => {
		prev.auth.user.email = email;
		prev.auth.error = "";
	});
const updatePassword = (password: string) => {
	const hashedPassword = new HashedString(password);
	setAppWithUpdate("updatePassword", [hashedPassword], (prev) => {
		prev.auth.user.password = hashedPassword;
		prev.auth.error = "";
	});
};

const updateIsModalOpenedFn = (isModalOpened: boolean) => () =>
	setAppWithUpdate("updateIsModalOpened", [isModalOpened], (prev) => {
		prev.auth.isModalOpened = isModalOpened;
	});

const updateLoginViewFn = (loginView: LoginViewType) => () =>
	void document.startViewTransition(() =>
		setAppWithUpdate("updateLoginView", [loginView], (prev) => {
			prev.auth.loginView = loginView;
		})
	);

const _updateLoginIsLoading = () =>
	setAppWithUpdate("updateLoginIsLoading", (prev) => {
		prev.auth.isLoading = true;
	});

const _updateTokenAndRole = (token: HashedString, role: RoleType) =>
	setAppWithUpdate("updateToken", [token], (prev) => {
		prev.auth.token = token;
		prev.auth.user.role = role;
		prev.auth.isLoading = false;
		prev.auth.error = "";
		prev.auth.isModalOpened = false;
	});

const _updateLoginError = (error: string) =>
	setAppWithUpdate("updateLoginError", [error], (prev) => {
		prev.auth.isLoading = false;
		prev.auth.error = error;
	});

const loginFn = (email: string, password: string) => () => {
	_updateLoginIsLoading();
	return api.v1.auth.login
		.post({ email, password })
		.then(({ data, error }) => {
			if (data) {
				toast.success("Logged in successfully");
				_updateTokenAndRole(new HashedString(data.token), data.role);
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

const _updateResetPasswordView = () =>
	setAppWithUpdate("updateResetPasswordView", [], (prev) => {
		prev.auth.loginView = "Login";
		prev.auth.isLoading = false;
	});

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

const logout = () =>
	setAppWithUpdate("logout", [], (prev) => {
		prev.auth.token = new HashedString("");
		prev.auth.user.role = null;
		prev.imageView = "Public";
	});

export const auth = {
	email: { update: updateEmail },
	password: { update: updatePassword, resetFn: resetPasswordFn },
	isModalOpened: { updateFn: updateIsModalOpenedFn },
	loginView: { updateFn: updateLoginViewFn },
	loginFn,
	account: { createFn: createAccountFn },
	logout,
};
