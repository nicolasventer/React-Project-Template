import { AppLifeCycle } from "@/components/app/AppLifeCycle";
import { RouterRender } from "@/routerInstance.gen";
import "./index.lazy.css";

// @routeExport
export const MainLayout = () => (
	<div className="app-shell">
		<AppLifeCycle />
		<RouterRender subPath="/" />
	</div>
);
