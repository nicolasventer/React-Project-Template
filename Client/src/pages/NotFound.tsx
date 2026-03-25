import { DarkModeButton } from "@/components/_common/DarkModeButton";
import { LangButton } from "@/components/_common/LangButton";
import { app } from "@/logic";
import "./NotFound.css";

export const NotFound = () => {
	const tr = app.tr.use();

	return (
		<div className="notFound">
			<header className="notFound-header">
				<span />
				<div className="pageHeader-actions">
					<LangButton tr={tr} />
					<DarkModeButton tr={tr} />
				</div>
			</header>
			<main className="notFound-main">
				<h1 className="notFound-title">{tr["404 Not Found"]}</h1>
				<p className="notFound-text">{tr["Go to Home page"]}</p>
				<button type="button" className="notFound-btn" onClick={app.route.navigateToRouteFn({ url: "/" })}>
					{tr["Go to Home page"]}
				</button>
			</main>
		</div>
	);
};
