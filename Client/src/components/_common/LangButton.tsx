import type { Tr } from "@/dict/lang/en";
import { app } from "@/logic";
import clsx from "clsx";
import "./LangButton.css";

export type LangButtonProps = { tr: Tr };

export const LangButton = ({ tr }: LangButtonProps) => {
	const lang = app.lang.state.data.use();
	const loading = app.lang.state.isLoading.use();

	const switchLabel = lang === "en" ? tr.LangSwitchToFrench : tr.LangSwitchToEnglish;

	return (
		<button
			type="button"
			className={clsx("langButton", loading && "langButton--loading")}
			disabled={loading}
			aria-busy={loading}
			aria-label={loading ? tr.LangLoading : switchLabel}
			title={loading ? tr.LangLoading : switchLabel}
			onClick={app.lang.updateFn(lang === "en" ? "fr" : "en", true)}
		>
			{loading ? (
				<span className="langButton-spinner" aria-hidden />
			) : (
				<span className="langButton-code" aria-hidden>
					{lang.toUpperCase()}
				</span>
			)}
		</button>
	);
};
