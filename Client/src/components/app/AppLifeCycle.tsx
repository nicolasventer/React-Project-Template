import { dict } from "@/dict";
import { app } from "@/logic";
import { useEffect } from "react";

export const AppLifeCycle = () => {
	const lang = app.lang.data.use();

	// load the translations when the language changes
	useEffect(() => void dict[lang]().then(app.tr.data.setValue), [lang]);

	// sync the local storage state with the app state
	const colorScheme = app.colorScheme.data.use();
	const todos = app.todos.data.use();
	const config = app.config.data.use();
	useEffect(() => app.localStorage.update({ lang, colorScheme, todos, config }), [lang, colorScheme, todos, config]);

	// update the body class when the color scheme changes
	useEffect(() => document.documentElement.setAttribute("data-theme", colorScheme), [colorScheme]);

	// update the todo app styles when the config changes
	useEffect(() => {
		const el = document.getElementsByClassName("todo-app");
		if (el.length === 0) return;
		const todoApp = el[0] as HTMLDivElement;
		todoApp.style.setProperty("--todo-light-mode-accent-color", config.lightModeAccentColor);
		todoApp.style.setProperty("--todo-dark-mode-accent-color", config.darkModeAccentColor);
		todoApp.style.setProperty("font-size", config.fontSize);
		todoApp.style.setProperty("--todo-row-top-padding", config.paddingTop);
	}, [config]);

	return null;
};
