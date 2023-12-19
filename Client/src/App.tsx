import { createTheme, MantineProvider } from "@mantine/core";
import "@mantine/core/styles.css";
import { useMediaQuery, useViewportSize } from "@mantine/hooks";
import { useEffect } from "react";
import { Toaster } from "react-hot-toast";
import { clientEnv } from "./clientEnv";
import { globalState } from "./context/GlobalState";
import { HomePage } from "./pages/exports_";
import type { HomePage as _HomePage } from "./pages/Home";
import { WriteToolboxClasses } from "./utils/ComponentToolbox";

const theme = createTheme({});

/**
 * Renders all pages of the application based on the URL. All pages are lazy loaded. \
 * It also updates the {@link globalState | `global states`} `isAboveMd` and `isBelowXxs` based on the screen size. \
 * Renders the {@link _HomePage | `HomePage`} if the URL is `/` or `/coord`.
 * @returns The rendered application.
 */
export const App = () => {
	const url = new URL(window.location.href);

	const isAboveMd = useMediaQuery("(min-width: 62em)");
	const isBelowXxs = useMediaQuery("(max-width: 25em)");
	const { height, width } = useViewportSize();
	useEffect(() => void (globalState.isAboveMd.value = !!isAboveMd), [isAboveMd]);
	useEffect(() => void (globalState.isBelowXxs.value = !!isBelowXxs), [isBelowXxs]);
	useEffect(() => void (globalState.viewportSize.value = { height, width }), [height, width]);

	return (
		<>
			<WriteToolboxClasses />
			<Toaster position="bottom-center" toastOptions={{ duration: 2000 }} />
			<MantineProvider theme={theme} forceColorScheme={globalState.colorScheme.value}>
				{url.pathname === `${clientEnv.BASE_URL}/` && <HomePage />}
			</MantineProvider>
		</>
	);
};
