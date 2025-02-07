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

// @routeExport
export const MainLayout = () => {
	const { height, width } = useViewportSize();
	useEffect(() => actions.viewportSize.update({ height, width }), [height, width]);

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
