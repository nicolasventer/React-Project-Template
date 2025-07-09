import { clientEnv } from "@/clientEnv";
import type { Lang } from "@/dict";
import type { ColorSchemeType, RoleType } from "@/Shared/SharedModel";
import { en } from "@/tr/en";
import type { ImageViewType, LoginViewType } from "@/types";
import type { NotArray } from "@/utils/Redux/GlobalApp";
import { GlobalApp } from "@/utils/Redux/GlobalApp";
import { HashedString } from "@/utils/Redux/HashedString";
import type { TypeOfStore } from "@/utils/Store";
import { store } from "@/utils/Store";
import { getUrl } from "@/utils/useNavigate";

export const LOCAL_STORAGE_KEY = "template_globalState" as const;

export type LocalStorageState = {
	lang: Lang;
	colorScheme: ColorSchemeType;
	userEmail: string;
	userPassword: string;
	userRole: RoleType | null;
	authToken: string;
};
export const loadLocalStorageState = (): LocalStorageState => {
	const storedLocalStorageState = JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEY) ?? "{}") as Partial<LocalStorageState>;

	return {
		lang: storedLocalStorageState.lang ?? "en",
		colorScheme: storedLocalStorageState.colorScheme ?? "dark",
		userEmail: storedLocalStorageState.userEmail ?? "",
		userPassword: storedLocalStorageState.userPassword ?? "",
		userRole: storedLocalStorageState.userRole ?? null,
		authToken: storedLocalStorageState.authToken ?? "",
	};
};
const localStorageState = loadLocalStorageState();
export const localStorageStateStore = store(localStorageState);

export const { appStore, setAppWithUpdate, useInit, useSetAppEnabled } = new GlobalApp({
	url: getUrl().replace(clientEnv.BASE_URL, ""),
	lang: {
		value: localStorageState.lang,
		isLoading: false,
	},
	colorScheme: {
		value: localStorageState.colorScheme,
		isLoading: false,
	},
	wakeLock: {
		isEnabled: false,
		isLoading: false,
	},
	errorMessage: null as string | null,
	shell: {
		isAboveXl: false,
		isAboveMd: false,
	},
	imageView: "Public" as ImageViewType,
	auth: {
		isModalOpened: false,
		loginView: "Login" as LoginViewType,
		isLoading: false,
		token: new HashedString(localStorageState.authToken),
		error: "",
		user: {
			email: localStorageState.userEmail,
			password: new HashedString(localStorageState.userPassword),
			role: localStorageState.userRole,
		},
	},
});
export type AppState = TypeOfStore<typeof appStore>;
export const useApp = () => appStore.use();

export const trStore = store(en);
export const useTr = () => trStore.use();

export const mainContentStore = store<HTMLDivElement | null>(null);

export const handlePromise = <T>(
	promise: Promise<T>,
	{
		functionName,
		functionParams = [],
		onUpdateLoading,
		onSuccess,
		onError,
	}: {
		functionName: string;
		functionParams?: NotArray<unknown>[];
		onUpdateLoading: (prev: AppState, isLoading: boolean) => void;
		onSuccess: (prev: AppState, value: T) => void;
		onError?: (prev: AppState) => void;
	}
) => {
	const loadingFunctionName = `${functionName}Loading`;
	setAppWithUpdate(loadingFunctionName, functionParams, (prev) => onUpdateLoading(prev, true));
	return promise
		.then((value) => {
			setAppWithUpdate(functionName, functionParams, (prev) => {
				prev.errorMessage = null;
				onSuccess(prev, value);
				onUpdateLoading(prev, false);
			});
		})
		.catch((error) => {
			setAppWithUpdate(functionName, functionParams, (prev) => {
				prev.errorMessage =
					typeof error === "object" && error && "message" in error ? (error.message as string) : "Unknown error";
				onError?.(prev);
				onUpdateLoading(prev, false);
			});
		});
};
