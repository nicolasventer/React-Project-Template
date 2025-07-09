import { api } from "@/api/api";
import { setAppWithUpdate } from "@/globalState";
import { HashedString } from "@/utils/Redux/HashedString";

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

const _updateLoginIsLoading = () =>
	setAppWithUpdate("updateLoginIsLoading", (prev) => {
		prev.auth.isLoading = true;
	});

const _updateToken = (token: HashedString) =>
	setAppWithUpdate("updateToken", [token], (prev) => {
		prev.auth.token = token;
		prev.auth.isLoading = false;
	});

const _updateLoginError = (error: string) =>
	setAppWithUpdate("updateLoginError", [error], (prev) => {
		prev.auth.isLoading = false;
		prev.auth.error = error.toString();
	});

const loginFn = (email: string, password: string) => () => {
	_updateLoginIsLoading();
	api.v1.auth.login
		.post({ email, password: password })
		.then(({ data, error }) => {
			if (data) _updateToken(new HashedString(data.token));
			else if (error.status === 401) _updateLoginError(error.value);
			else if (error.status === 422) _updateLoginError(error.value.summary ?? "Validation error");
		})
		.catch((error) =>
			_updateLoginError(typeof error === "object" && error && "message" in error ? (error.message as string) : "Unknown error")
		);
};

export const auth = { updateEmail, updatePassword, updateIsModalOpenedFn, loginFn };
