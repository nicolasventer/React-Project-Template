import configStr from "@/../config.jsonc?raw";
import type { Config } from "@/config/Config";
import { getValidConfig } from "@/config/Config";
import { createRoot } from "react-dom/client";

export function getConfig(): Config {
	try {
		return getValidConfig(configStr);
	} catch (error) {
		if (typeof document !== "undefined")
			createRoot(document.getElementById("root")!).render(
				<div>
					<h1>Config Error:</h1>
					<pre>{error instanceof Error ? error.message : JSON.stringify(error, null, 2)}</pre>
				</div>,
			);
		throw error;
	}
}

export const config: Config = getConfig();
