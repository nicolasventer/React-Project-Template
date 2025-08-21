import { api } from "@/api/api";
import { clientEnv } from "@/clientEnv";
// eslint-disable-next-line project-structure/independent-modules
import type { UserColumnState, UserFilterState, UserSortState } from "@/components/users/UsersManagers";
// eslint-disable-next-line project-structure/independent-modules
import { userColumnManager, userFilterManager, userSortManager } from "@/components/users/UsersManagers";
import type { Lang } from "@/dict";
import type { ColorSchemeType, MultiImageOutput, MultiUserOutput, RoleType, UserOutput } from "@/Shared/SharedModel";
import { en } from "@/tr/en";
import type { DeepTypeOfStore } from "@/utils/Store";
import { store } from "@/utils/Store";
import { getUrl } from "@/utils/useNavigate";
import { jwtDecode } from "jwt-decode";
import { createRef } from "react";

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

export const trStore = store(en);
export const useTr = () => trStore.use();

const refreshToken = (token: string) =>
	api.v1.auth.token.refresh.get({ headers: { "x-token": token } }).then(({ data, error }) => {
		if (data) {
			app.auth.token.setValue(data.token);
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

// used to override the default back button behavior (mobile only)
export const goBackCallbackRef = createRef<() => void>();

export const app = {
	colorScheme: {
		data: store(localStorageState.colorScheme),
		isLoading: store(false),
	},
	lang: {
		data: store(localStorageState.lang),
		isLoading: store(false),
	},
	wakeLock: {
		isEnabled: store(false),
		isLoading: store(false),
	},
	auth: {
		isModalOpened: store(false),
		loginView: store<LoginViewType>("Login"),
		isLoading: store(false),
		token: store(localStorageState.authToken),
		error: store(""),
		user: {
			email: store(""),
			password: store(""),
			role: store(localStorageState.userRole),
		},
	},
	url: store(getUrl().replace(clientEnv.BASE_URL, "")),
	shell: {
		isAboveXl: store(false),
		isAboveMd: store(false),
	},
	imageView: store(localStorageState.imageView),
	images: {
		error: store(""),
		isLoading: store(false),
		values: store<MultiImageOutput["images"]>([]),
	},
	users: {
		error: store(""),
		isLoading: store(false),
		values: store<MultiUserOutput["users"]>([]),
		editedValues: store<Record<number, UserOutput | null>>({}),
		sort: store(localStorageState.userSortState),
		filter: store(localStorageState.userFilterState),
		column: store(localStorageState.userColumnState),
		isSortAdditive: store(localStorageState.userIsSortAdditive),
	},
	vote: {
		error: store(""),
		loadingImageId: store<number | null>(null),
	},
	profile: {
		isLoading: store(false),
		error: store(""),
		newPassword: store(""),
		confirmNewPassword: store(""),
		deleteAccount: {
			buttonPressedAt: store<number | null>(null),
		},
	},
	resetPassword: {
		isLoading: store(false),
		error: store(""),
		newPassword: store(""),
		inputToken: store(""),
	},
};

export type AppState = DeepTypeOfStore<typeof app>;
