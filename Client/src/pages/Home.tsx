import { DarkModeButton } from "@/components/_common/DarkModeButton";
import { LangButton } from "@/components/_common/LangButton";
import { app } from "@/logic";
import "./Home.css";

export const Home = () => {
	const tr = app.tr.use();

	return (
		<div className="home">
			<header className="home-header">
				<span />
				<div className="page-header-actions">
					<LangButton tr={tr} />
					<DarkModeButton tr={tr} />
				</div>
			</header>
			<main className="home-main">
				<h1 className="home-title">{tr.home.heading.title}</h1>
				<p className="home-subtitle">{tr.home.heading.subtitle}</p>
				<button type="button" className="home-cta" onClick={app.route.fn.navigateToRouteFn("/todo?id", {})}>
					{tr.home.action.openTodos}
				</button>
			</main>
		</div>
	);
};
