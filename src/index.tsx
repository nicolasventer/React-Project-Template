import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";

try {
	const { App } = await import("./app/components/App");
	createRoot(document.getElementById("root")!).render(
		<StrictMode>
			<App />
		</StrictMode>,
	);
} catch (error) {
	createRoot(document.getElementById("root")!).render(
		<div>
			<h1>Config Error:</h1>
			<pre>{error instanceof Error ? error.message : JSON.stringify(error, null, 2)}</pre>
		</div>,
	);
	throw error;
}
