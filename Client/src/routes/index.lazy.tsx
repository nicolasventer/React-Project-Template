import { actions, st } from "@/actions/actions.impl";
import { CustomConsole } from "@/components/_app/CustomConsole";
import { RouterRender } from "@/routerInstance.gen";
import { FullViewport, WriteToolboxClasses } from "@/utils/ComponentToolbox";
import { createTheme, MantineProvider } from "@mantine/core";
import { useViewportSize } from "@mantine/hooks";
import { useEffect } from "react";
import { Toaster } from "react-hot-toast";

const theme = createTheme({});

actions.console.type.update("both");

/**
 * The main layout of the application. \
 * It renders:
 * - {@link FullViewport},
 * - {@link WriteToolboxClasses},
 * - `MantineProvider` with the theme and `st.colorScheme.current.value`,
 * - `Toaster` with the position "bottom-center" and the toast options duration 2000,
 * - {@link CustomConsole},
 * - {@link RouterRender} with the subPath "/", which renders the current route.
 * It also updates `actions.viewportSize` when the viewport size changes.
 * @returns the main layout of the application
 */
// @routeExport
export const MainLayout = () => {
	const { height, width } = useViewportSize();
	useEffect(() => actions.viewportSize._update({ height, width }), [height, width]);

	return (
		<FullViewport>
			<WriteToolboxClasses />
			<MantineProvider theme={theme} forceColorScheme={st.colorScheme.current.value}>
				<CustomConsole />
				<Toaster position="bottom-center" toastOptions={{ duration: 2000 }} />
				<RouterRender subPath="/" />
			</MantineProvider>
		</FullViewport>
	);
};
