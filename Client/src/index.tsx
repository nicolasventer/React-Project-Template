import "preact/debug";

import { enableApiMock } from "@/api/api.config";

import "@/index.css";
import "@mantine/core/styles.css";

import { clientEnv } from "@/clientEnv";
import { setRouterBaseRoute } from "@/routerInstance.gen";
import { MainLayout } from "@/routes";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";

enableApiMock();

setRouterBaseRoute(clientEnv.BASE_URL);

// define the startViewTransition function if it does not exist (for Firefox)
if (!document.startViewTransition)
	document.startViewTransition = (fn: () => void) => {
		const ready = new Promise<undefined>((resolve) => resolve(undefined));
		const finished = new Promise<undefined>((resolve) => (fn(), resolve(undefined)));
		const updateCallbackDone = new Promise<undefined>((resolve) => resolve(undefined));
		const skipTransition = () => {};
		return { ready, finished, updateCallbackDone, skipTransition };
	};

createRoot(document.getElementById("root")!).render(
	<StrictMode>
		<MainLayout />
	</StrictMode>
);
