import { setIsAboveMd, setIsBelowXxs, setViewportSize } from "@/features/_Common/common.setters";
import { CustomConsole } from "@/features/_Common/CustomConsole/CustomConsole";
import { setConsoleType } from "@/features/_Common/CustomConsole/CustomConsole.utils";
import { gs } from "@/gs";
import { FullViewport, WriteToolboxClasses } from "@/libs/StrongBox/ComponentToolbox";
import { RouterRender } from "@/routerInstance.gen";
import { createTheme, MantineProvider } from "@mantine/core";
import { useMediaQuery, useViewportSize } from "@mantine/hooks";
import { useEffect } from "react";
import { Toaster } from "react-hot-toast";

const theme = createTheme({});

setConsoleType("both");

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
	useEffect(() => setIsAboveMd(!!isAboveMd), [isAboveMd]);
	useEffect(() => setIsBelowXxs(!!isBelowXxs), [isBelowXxs]);
	useEffect(() => setViewportSize({ height, width }), [height, width]);

	return (
		<FullViewport>
			<WriteToolboxClasses />
			<MantineProvider theme={theme} forceColorScheme={gs.colorScheme.value}>
				<CustomConsole />
				<Toaster position="bottom-center" toastOptions={{ duration: 2000 }} />
				<RouterRender subPath="/" />
			</MantineProvider>
		</FullViewport>
	);
};
