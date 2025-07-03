import { actions } from "@/actions/actions.impl";
import { clientEnv } from "@/clientEnv";
import { Shell } from "@/components/shell/Shell";
import { dict } from "@/dict";
import { appStore, LOCAL_STORAGE_KEY, localStorageStateStore, trStore, useInit, useSetAppEnabled, useTr } from "@/globalState";
import { navigateToCustomRouteFn } from "@/routerInstance.gen";
import { FullViewport, WriteToolboxClasses } from "@/utils/ComponentToolbox";
import { useDebug } from "@/utils/GlobalDebugOneFile";
import { configurePreview } from "@/utils/withPreview";
import { StatusBar, Style } from "@capacitor/status-bar";
import { MantineProvider } from "@mantine/core";
import { useMediaQuery } from "@mantine/hooks";
import type { ReactNode } from "react";
import { useEffect } from "react";

configurePreview("static", false);

const SafeAreaInset = ({ children }: { children?: ReactNode }) => (
	<div style={{ height: "100%" }}>
		<div className="safe-area-inset-top" />
		<div className="safe-area-inset-bottom" />
		<div className="safe-area-inset-left" />
		<div className="safe-area-inset-right" />
		<div className="safe-area-inset">{children}</div>
	</div>
);

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
	const isAsideOpened = app.shell.aside.isOpened;
	const isNavbarOpened = app.shell.navbar.isOpened;
	const usersFilter = app.users.filter;
	localStorageStateStore.useEffect(
		(setLocalStorageState) => setLocalStorageState({ lang, colorScheme, isAsideOpened, isNavbarOpened, usersFilter }),
		[lang, colorScheme, isAsideOpened, isNavbarOpened, usersFilter]
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

	return (
		<MantineProvider forceColorScheme={app.colorScheme.value}>
			<WriteToolboxClasses />
			<FullViewport>
				<SafeAreaInset>
					<Shell app={app} isSetAppEnabled={isSetAppEnabled} tr={tr} />
				</SafeAreaInset>
			</FullViewport>
			{/* <RenderDebug expand position="bottom-left" /> */}
		</MantineProvider>
	);
};
