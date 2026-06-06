import "@/bootstrap/config"; // ensures config is loaded and validated, and renders error page if invalid

import { App } from "@/app/components/App";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";

createRoot(document.getElementById("root")!).render(
	<StrictMode>
		<App />
	</StrictMode>,
);
