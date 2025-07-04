import { api } from "@/api/api";
import { clientEnv } from "@/clientEnv";
import type { UserColumnState, UserFilterState, UserSortState } from "@/components/users/UsersManagers";
import { userColumnManager, userFilterManager, userSortManager } from "@/components/users/UsersManagers";
import type { Lang } from "@/dict";
import type { ColorSchemeType, MultiImageOutput, MultiUserOutput, RoleType, UserOutput } from "@/Shared/SharedModel";
import { en } from "@/tr/en";
import type { NotArray } from "@/utils/Redux/GlobalApp";
import { GlobalApp } from "@/utils/Redux/GlobalApp";
import { HashedString } from "@/utils/Redux/HashedString";
import type { TypeOfStore } from "@/utils/Store";
import { store } from "@/utils/Store";
import { getUrl } from "@/utils/useNavigate";
import { jwtDecode } from "jwt-decode";

export const IMAGE_VIEW_VALUES = ["Public", "You"] as const;
export type ImageViewType = (typeof IMAGE_VIEW_VALUES)[number];

export const LOGIN_VIEW_VALUES = ["Login", "Create account", "Forgot password?"] as const;
export type LoginViewType = (typeof LOGIN_VIEW_VALUES)[number];

export const LOCAL_STORAGE_KEY = "template_globalState" as const;

export type LocalStorageState = {
	lang: Lang;
	colorScheme: ColorSchemeType;
	userRole: RoleType | null;
	authToken: string;
	imageView: ImageViewType;
	userSortState: UserSortState;
	userFilterState: UserFilterState;
	userColumnState: UserColumnState;
	userIsSortAdditive: boolean;
};
export const loadLocalStorageState = (): LocalStorageState => {
	const storedLocalStorageState = JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEY) ?? "{}") as Partial<LocalStorageState>;

	return {
		lang: storedLocalStorageState.lang ?? "en",
		colorScheme: storedLocalStorageState.colorScheme ?? "dark",
		userRole: storedLocalStorageState.userRole ?? null,
		authToken: storedLocalStorageState.authToken ?? "",
		imageView: storedLocalStorageState.imageView ?? "Public",
		userSortState: storedLocalStorageState.userSortState ?? userSortManager.createSortState(),
		userFilterState: storedLocalStorageState.userFilterState ?? userFilterManager.createFilterState(),
		userColumnState:
			storedLocalStorageState.userColumnState ?? userColumnManager.createColumnState(userColumnManager.getAllKeys()),
		userIsSortAdditive: storedLocalStorageState.userIsSortAdditive ?? false,
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
	imageView: localStorageState.imageView,
	images: {
		error: "",
		isLoading: false,
		values: [] as MultiImageOutput["images"],
	},
	users: {
		error: "",
		isLoading: false,
		values: [] as MultiUserOutput["users"],
		editedValues: {} as Record<number, UserOutput | null>,
		sort: localStorageState.userSortState,
		filter: localStorageState.userFilterState,
		column: localStorageState.userColumnState,
		isSortAdditive: localStorageState.userIsSortAdditive,
	},
	vote: {
		error: "",
		loadingImageId: null as number | null,
	},
	auth: {
		isModalOpened: false,
		loginView: "Login" as LoginViewType,
		isLoading: false,
		token: new HashedString(localStorageState.authToken),
		error: "",
		user: {
			email: "",
			password: new HashedString(""),
			role: localStorageState.userRole,
		},
	},
	profile: {
		isLoading: false,
		error: "",
		newPassword: new HashedString(""),
		confirmNewPassword: new HashedString(""),
		deleteAccount: {
			buttonPressedAt: null as number | null,
		},
	},
	resetPassword: {
		isLoading: false,
		error: "",
		newPassword: new HashedString(""),
		inputToken: "",
	},
});
export type AppState = TypeOfStore<typeof appStore>;
export const useApp = () => appStore.use();

export const trStore = store(en);
export const useTr = () => trStore.use();

export const mainContentStore = store<HTMLDivElement | null>(null);

const updateToken = (token: string) =>
	setAppWithUpdate("updateToken", [token], (prev) => {
		prev.auth.token = new HashedString(token);
	});

const refreshToken = (token: string) =>
	api.v1.auth.token.refresh.get({ headers: { "x-token": token } }).then(({ data, error }) => {
		if (data) {
			updateToken(data.token);
			return data.token;
		} else throw error;
	});

export const checkAndRefreshToken = async (token: string) => {
	if (!token) return token;
	try {
		const decoded = jwtDecode<{ exp?: number } | null>(token);
		if (decoded && decoded.exp) {
			const now = Math.floor(Date.now() / 1000);
			if (decoded.exp < now) return refreshToken(token);
		}
		return token;
	} catch {
		return refreshToken(token);
	}
};

/** @deprecated do not use this function, just manage the state manually */
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
