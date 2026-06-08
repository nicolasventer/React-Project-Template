import type { Tr } from "@/app/dict/lang/en";
import { lang } from "@/shared/logic/lang";
import clsx from "clsx";
import styles from "./LangButton.module.css";

export type LangButtonProps = { tr: Tr };

export const LangButton = ({ tr }: LangButtonProps) => {
	const langV = lang.data.use();
	const loading = lang.isLoading.use();

	const switchLabel = langV === "en" ? tr.lang.switchToFrench : tr.lang.switchToEnglish;

	return (
		<button
			type="button"
			className={clsx(styles.button, loading && styles.loading)}
			disabled={loading}
			aria-busy={loading}
			aria-label={loading ? tr.lang.loading : switchLabel}
			title={loading ? tr.lang.loading : switchLabel}
			onClick={lang.fn.updateFn(langV === "en" ? "fr" : "en", true)}
		>
			{loading ? (
				<span className={styles.spinner} aria-hidden />
			) : (
				<span className={styles.code} aria-hidden>
					{langV.toUpperCase()}
				</span>
			)}
		</button>
	);
};
