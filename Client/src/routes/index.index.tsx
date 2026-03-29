import { DarkModeButton } from "@/components/_common/DarkModeButton";
import { LangButton } from "@/components/_common/LangButton";
import { app } from "@/logic";
import { navigateToRouteFn } from "@/routerInstance.gen";
import "./index.index.css";

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
				<h1 className="home-title">{tr.Home}</h1>
				<p className="home-subtitle">{tr.HomeSubtitle}</p>
				<button type="button" className="home-cta" onClick={navigateToRouteFn("/todo?id", {})}>
					{tr.OpenTodos}
				</button>
			</main>
		</div>
	);
};
