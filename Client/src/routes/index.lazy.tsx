import { actions } from "@/actions/actions.impl";
import { clientEnv } from "@/clientEnv";
import { Header } from "@/components/mainLayout/Header";
import { dict } from "@/dict";
import { app, LOCAL_STORAGE_KEY, localStorageStateStore, trStore } from "@/globalState";
import { navigateToCustomRouteFn, RouterRender } from "@/routerInstance.gen";
import { FullViewport, Vertical, WriteToolboxClasses } from "@/utils/ComponentToolbox";
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
	const lang = app.lang.data.use();

	// load the translations when the language changes
	trStore.useEffect((setTr) => void dict[lang]().then(setTr), [lang]);

	// sync the app state with the media query
	const isAboveXl = !!useMediaQuery("(min-width: 88em)");
	const isAboveMd = !!useMediaQuery("(min-width: 62em)");
	useEffect(() => actions.shell.isAboveXl.update(isAboveXl), [isAboveXl]);
	useEffect(() => actions.shell.isAboveMd.update(isAboveMd), [isAboveMd]);

	// navigate to the app state url
	useEffect(() => navigateToCustomRouteFn(clientEnv.BASE_URL + app.url)(), [app.url]);

	// sync the local storage state with the app state
	const colorScheme = app.colorScheme.data.use();
	const userRole = app.auth.user.role.use();
	const authToken = app.auth.token.use();
	const imageView = app.imageView.use();
	const userSortState = app.users.sort.use();
	const userFilterState = app.users.filter.use();
	const userColumnState = app.users.column.use();
	const userIsSortAdditive = app.users.isSortAdditive.use();
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
		document.body.classList.toggle("dark", colorScheme === "dark");
		StatusBar.setStyle({ style: colorScheme === "dark" ? Style.Dark : Style.Light }).catch(() => {});
	}, [colorScheme]);

	return (
		<MantineProvider forceColorScheme={colorScheme} theme={theme}>
			<WriteToolboxClasses />
			<FullViewport>
				{/* <SafeAreaInset> */}
				<Vertical gap={6} padding={12} heightFull>
					<Header />
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
