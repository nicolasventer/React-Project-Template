import { actions } from "@/actions/actions.impl";
import { clientEnv } from "@/clientEnv";
import { Header } from "@/components/mainLayout/Header";
import { dict } from "@/dict";
import { appStore, LOCAL_STORAGE_KEY, localStorageStateStore, trStore, useInit, useSetAppEnabled, useTr } from "@/globalState";
import { navigateToCustomRouteFn, RouterRender, useCurrentRoute } from "@/routerInstance.gen";
import { FullViewport, Vertical, WriteToolboxClasses } from "@/utils/ComponentToolbox";
import { useDebug } from "@/utils/GlobalDebugOneFile";
import { StatusBar, Style } from "@capacitor/status-bar";
import { createTheme, MantineProvider, Modal } from "@mantine/core";
import { useMediaQuery } from "@mantine/hooks";
import { useEffect } from "react";
import { Toaster } from "react-hot-toast";
import { Tooltip } from "react-tooltip";

// const SafeAreaInset = ({ children }: { children?: ReactNode }) => (
// 	<div style={{ height: "100%" }}>
// 		<div className="safe-area-inset-top" />
// 		<div className="safe-area-inset-bottom" />
// 		<div className="safe-area-inset-left" />
// 		<div className="safe-area-inset-right" />
// 		<div className="safe-area-inset">{children}</div>
// 	</div>
// );

const theme = createTheme({
	components: {
		Modal: Modal.extend({ defaultProps: { zIndex: 500 } }),
	},
});

// @routeExport
export const MainLayout = () => {
	// initialize the app state and the redux store
	const app = useInit();

	// load the translations when the language changes
	trStore.useEffect((setTr) => void dict[app.lang.value]().then(setTr), [app.lang.value]);

	// sync the app state with the media query
	const isAboveXl = !!useMediaQuery("(min-width: 88em)");
	const isAboveMd = !!useMediaQuery("(min-width: 62em)");
	appStore.useEffect(() => actions.shell.isAboveXl.update(isAboveXl), [isAboveXl]);
	appStore.useEffect(() => actions.shell.isAboveMd.update(isAboveMd), [isAboveMd]);

	// navigate to the app state url
	useEffect(() => navigateToCustomRouteFn(clientEnv.BASE_URL + app.url)(), [app.url]);

	// sync the local storage state with the app state
	const lang = app.lang.value;
	const colorScheme = app.colorScheme.value;
	const userRole = app.auth.user.role;
	const authToken = app.auth.token.get();
	const imageView = app.imageView;
	const userSortState = app.users.sort;
	const userFilterState = app.users.filter;
	const userColumnState = app.users.column;
	const userIsSortAdditive = app.users.isSortAdditive;
	localStorageStateStore.useEffect(
		(setLocalStorageState) =>
			setLocalStorageState({
				lang,
				colorScheme,
				userRole,
				authToken,
				imageView,
				userSortState,
				userFilterState,
				userColumnState,
				userIsSortAdditive,
			}),
		[lang, colorScheme, userRole, authToken, imageView, userSortState, userFilterState, userColumnState, userIsSortAdditive]
	);

	// save the local storage state to the local storage
	const localStorageState = localStorageStateStore.use();
	useEffect(() => localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(localStorageState)), [localStorageState]);

	// update the body class when the color scheme changes
	useEffect(() => {
		document.body.classList.toggle("dark", app.colorScheme.value === "dark");
		StatusBar.setStyle({ style: app.colorScheme.value === "dark" ? Style.Dark : Style.Light }).catch(() => {});
	}, [app.colorScheme.value]);

	// control the update of the app state
	const [isSetAppEnabled, setIsSetAppEnabled] = useSetAppEnabled();
	useDebug("boolean", "isSetAppEnabled", [isSetAppEnabled, setIsSetAppEnabled]);

	const tr = useTr();
	const { currentRoute } = useCurrentRoute();

	const isAuthenticated = !!app.auth.user.role;
	const password = app.auth.user.password.get();

	return (
		<MantineProvider forceColorScheme={app.colorScheme.value} theme={theme}>
			<WriteToolboxClasses />
			<FullViewport>
				{/* <SafeAreaInset> */}
				<Vertical gap={6} padding={12} heightFull>
					<Header
						isAuthenticated={isAuthenticated}
						tr={tr}
						isModalOpened={app.auth.isModalOpened}
						email={app.auth.user.email}
						password={password}
						authError={app.auth.error}
						isAuthLoading={app.auth.isLoading}
						loginView={app.auth.loginView}
						lang={app.lang.value}
						isLangLoading={app.lang.isLoading}
						colorScheme={app.colorScheme.value}
						isColorSchemeLoading={app.colorScheme.isLoading}
						role={app.auth.user.role}
						currentRoute={currentRoute}
					/>
					<RouterRender subPath="/" />
				</Vertical>
				{/* </SafeAreaInset> */}
			</FullViewport>
			<Toaster position="bottom-center" toastOptions={{ duration: 3000 }} />
			<Tooltip id="main-tooltip" />
			{/* <RenderDebug expand position="bottom-left" /> */}
		</MantineProvider>
	);
};
