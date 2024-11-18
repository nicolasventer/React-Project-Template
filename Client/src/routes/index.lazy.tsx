import { createTheme, MantineProvider } from "@mantine/core";
import "@mantine/core/styles.css";
import { useMediaQuery, useViewportSize } from "@mantine/hooks";
import { useEffect } from "react";
import { Toaster } from "react-hot-toast";
import { globalState, gs } from "../context/GlobalState";
import { RouterRender } from "../routerInstance.gen";
import { FullViewport, WriteToolboxClasses } from "../utils/ComponentToolbox";

const theme = createTheme({});

/**
 * Renders the {@link RouterRender | `router`}. \
 * It also updates the {@link globalState | `global states`} `isAboveMd` and `isBelowXxs` based on the screen size.
 * @returns The rendered application.
 */
// @routeExport
export const MainLayout = () => {
	const isAboveMd = useMediaQuery("(min-width: 62em)");
	const isBelowXxs = useMediaQuery("(max-width: 25em)");
	const { height, width } = useViewportSize();
	useEffect(() => void (globalState.isAboveMd.value = !!isAboveMd), [isAboveMd]);
	useEffect(() => void (globalState.isBelowXxs.value = !!isBelowXxs), [isBelowXxs]);
	useEffect(() => void (globalState.viewportSize.value = { height, width }), [height, width]);

	return (
		<FullViewport>
			<WriteToolboxClasses />
			<MantineProvider theme={theme} forceColorScheme={gs.colorScheme.value}>
				<Toaster position="bottom-center" toastOptions={{ duration: 2000 }} />
				<RouterRender subPath="/" />
			</MantineProvider>
		</FullViewport>
	);
};
