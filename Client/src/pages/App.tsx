import { AppLifeCycle } from "@/components/app/AppLifeCycle";
import { app } from "@/logic";
import { Home } from "@/pages/Home";
import { NotFound } from "@/pages/NotFound";
import { TodoApp } from "@/pages/Todo";
import { SwitchV } from "@/utils/MultiIf";
import "./App.css";

export const App = () => {
	const route = app.route.route.use();

	return (
		<div className="app-shell">
			<AppLifeCycle />
			<SwitchV
				value={route}
				transform={(r) => r.path}
				cases={[
					["/", () => <Home />],
					["/todo?id", (r) => <TodoApp selectedId={r.value.path === "/todo?id" ? r.value.params.id : undefined} />],
					["/404", () => <NotFound />],
				]}
			/>
		</div>
	);
};
