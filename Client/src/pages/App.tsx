import { AppLifeCycle } from "@/components/app/AppLifeCycle";
import { app } from "@/logic";
import { Home } from "@/pages/Home";
import { NotFound } from "@/pages/NotFound";
import { TodoApp } from "@/pages/Todo";
import { SwitchV } from "@/utils/MultiIf";
import "./App.css";

export const App = () => {
	const route = app.route.state.route.use();

	return (
		<div className="app-shell">
			<AppLifeCycle />
			<SwitchV
				value={route}
				transform={(r) => r.url}
				cases={[
					["/", () => <Home />],
					["/todo", () => <TodoApp />],
					["/todo?:id", (r) => <TodoApp selectedId={r.value.url === "/todo?:id" ? r.value.id : undefined} />],
					["/404", () => <NotFound />],
				]}
			/>
		</div>
	);
};
