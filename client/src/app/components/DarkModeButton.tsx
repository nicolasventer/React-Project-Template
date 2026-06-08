import type { Tr } from "@/app/dict/lang/en";
import { colorScheme } from "@/app/logic/colorsScheme";
import clsx from "clsx";
import styles from "./DarkModeButton.module.css";

export type DarkModeButtonProps = { tr: Tr };

const IconSun = () => (
	<svg className={styles.icon} viewBox="0 0 24 24" aria-hidden>
		<circle cx="12" cy="12" r="4" fill="currentColor" />
		<g stroke="currentColor" strokeWidth="2" strokeLinecap="round" fill="none">
			<path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41" />
		</g>
	</svg>
);

const IconMoon = () => (
	<svg className={styles.icon} viewBox="0 0 24 24" aria-hidden>
		<path fill="currentColor" d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
	</svg>
);

export const DarkModeButton = ({ tr }: DarkModeButtonProps) => {
	const colorSchemeV = colorScheme.data.use();
	const isDark = colorSchemeV === "dark";

	return (
		<button
			type="button"
			className={clsx(styles.button, isDark && styles.dark)}
			aria-pressed={isDark}
			aria-label={isDark ? tr.theme.switchToLight : tr.theme.switchToDark}
			title={isDark ? tr.theme.switchToLight : tr.theme.switchToDark}
			onClick={colorScheme.fn.updateFn(isDark ? "light" : "dark", true)}
		>
			<span className={styles.track} aria-hidden>
				<span className={styles.thumb}>{isDark ? <IconMoon /> : <IconSun />}</span>
			</span>
			<span className={styles.label} aria-hidden>
				{isDark ? tr.theme.dark : tr.theme.light}
			</span>
		</button>
	);
};
