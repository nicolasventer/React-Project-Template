import { DarkModeButton } from "@/components/_common/DarkModeButton";
import { LangButton } from "@/components/_common/LangButton";
import { app } from "@/logic";
import "./NotFound.css";

export const NotFound = () => {
	const tr = app.tr.use();

	return (
		<div className="not-found">
			<header className="not-found-header">
				<span />
				<div className="page-header-actions">
					<LangButton tr={tr} />
					<DarkModeButton tr={tr} />
				</div>
			</header>
			<main className="not-found-main">
				<h1 className="not-found-title">{tr.NotFoundTitle}</h1>
				<p className="not-found-text">{tr.GoToHomePage}</p>
				<button type="button" className="not-found-btn" onClick={app.route.fn.navigateToRouteFn("/")}>
					{tr.GoToHomePage}
				</button>
			</main>
		</div>
	);
};
