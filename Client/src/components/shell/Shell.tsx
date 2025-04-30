import { Aside } from "@/components/shell/Aside";
import { Header } from "@/components/shell/Header";
import { Main } from "@/components/shell/Main";
import { Navbar } from "@/components/shell/Navbar";
import type { AppState } from "@/globalState";
import type { Tr } from "@/tr/en";
import { Horizontal, Vertical } from "@/utils/ComponentToolbox";
import { Divider } from "@mantine/core";

export const Shell = ({ app, isSetAppEnabled, tr }: { app: AppState; isSetAppEnabled: boolean; tr: Tr }) => (
	<Vertical heightFull>
		<Header
			lang={app.lang.value}
			isLangLoading={app.lang.isLoading}
			colorScheme={app.colorScheme.value}
			isColorSchemeLoading={app.colorScheme.isLoading}
		/>
		<Divider />
		<Horizontal flexGrow overflowAuto>
			{/* overflowAuto help to fix the height to the remaining space */}
			<Navbar
				isAboveMd={app.shell.isAboveMd}
				isNavbarOpened={app.shell.navbar.isOpened}
				isSetAppEnabled={isSetAppEnabled}
				lang={app.lang.value}
				tr={tr}
			/>
			<Divider orientation="vertical" />
			<Main />
			<Divider orientation="vertical" />
			<Aside
				isAboveXl={app.shell.isAboveXl}
				isAsideOpened={app.shell.aside.isOpened}
				isMainScrollable={app.shell.main.isScrollable}
				tr={tr}
			/>
		</Horizontal>
	</Vertical>
);
