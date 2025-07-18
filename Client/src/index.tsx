import "@/index.css";
import "@mantine/core/styles.css";

import { clientEnv } from "@/clientEnv";
import { setRouterBaseRoute } from "@/routerInstance.gen";
import { MainLayout } from "@/routes";
import { configurePreview } from "@/utils/withPreview";
import { App } from "@capacitor/app";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";

setRouterBaseRoute(clientEnv.BASE_URL);

configurePreview("static", false);

App.addListener("backButton", ({ canGoBack }) => (canGoBack ? window.history.back() : App.exitApp()));

// need to disable strict mode to use the autoEnableSetApp feature of the redux devtools
const bStrictMode = true;

// define the startViewTransition function if it does not exist (for Firefox)
if (!document.startViewTransition)
	// eslint-disable-next-line @typescript-eslint/ban-ts-comment
	// @ts-ignore
	document.startViewTransition = (fn: () => void) => {
		const ready = new Promise<undefined>((resolve) => resolve(undefined));
		const finished = new Promise<undefined>((resolve) => (fn(), resolve(undefined)));
		const updateCallbackDone = new Promise<undefined>((resolve) => resolve(undefined));
		const skipTransition = () => {};
		return { ready, finished, updateCallbackDone, skipTransition };
	};

createRoot(document.getElementById("root")!).render(
	bStrictMode ? (
		<StrictMode>
			<MainLayout />
		</StrictMode>
	) : (
		<MainLayout />
	)
);
