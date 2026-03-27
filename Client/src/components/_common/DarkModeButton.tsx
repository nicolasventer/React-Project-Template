import type { Tr } from "@/dict/lang/en";
import { app } from "@/logic";
import clsx from "clsx";
import "./DarkModeButton.css";

export type DarkModeButtonProps = { tr: Tr };

const IconSun = () => (
	<svg className="dark-mode-button-icon" viewBox="0 0 24 24" aria-hidden>
		<circle cx="12" cy="12" r="4" fill="currentColor" />
		<g stroke="currentColor" strokeWidth="2" strokeLinecap="round" fill="none">
			<path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41" />
		</g>
	</svg>
);

const IconMoon = () => (
	<svg className="dark-mode-button-icon" viewBox="0 0 24 24" aria-hidden>
		<path fill="currentColor" d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
	</svg>
);

export const DarkModeButton = ({ tr }: DarkModeButtonProps) => {
	const colorScheme = app.colorScheme.state.data.use();
	const isDark = colorScheme === "dark";

	return (
		<button
			type="button"
			className={clsx("dark-mode-button", isDark && "dark-mode-button--dark")}
			aria-pressed={isDark}
			aria-label={isDark ? tr.ThemeSwitchToLight : tr.ThemeSwitchToDark}
			title={isDark ? tr.ThemeSwitchToLight : tr.ThemeSwitchToDark}
			onClick={app.colorScheme.updateFn(isDark ? "light" : "dark", true)}
		>
			<span className="dark-mode-button-track" aria-hidden>
				<span className="dark-mode-button-thumb">{isDark ? <IconMoon /> : <IconSun />}</span>
			</span>
			<span className="dark-mode-button-label" aria-hidden>
				{isDark ? tr.ThemeDark : tr.ThemeLight}
			</span>
		</button>
	);
};
