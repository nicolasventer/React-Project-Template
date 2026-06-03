import { app } from "@/logic";
import type { SharedTr } from "@/shared/dict/lang/en";
import clsx from "clsx";
import "./LangButton.css";

export type LangButtonProps = { tr: SharedTr };

export const LangButton = ({ tr }: LangButtonProps) => {
	const lang = app.lang.data.use();
	const loading = app.lang.isLoading.use();

	const switchLabel = lang === "en" ? tr.lang.action.switchToFrench : tr.lang.action.switchToEnglish;

	return (
		<button
			type="button"
			className={clsx("lang-button", loading && "lang-button--loading")}
			disabled={loading}
			aria-busy={loading}
			aria-label={loading ? tr.lang.status.loading : switchLabel}
			title={loading ? tr.lang.status.loading : switchLabel}
			onClick={app.lang.fn.updateFn(lang === "en" ? "fr" : "en", true)}
		>
			{loading ? (
				<span className="lang-button-spinner" aria-hidden />
			) : (
				<span className="lang-button-code" aria-hidden>
					{lang.toUpperCase()}
				</span>
			)}
		</button>
	);
};
