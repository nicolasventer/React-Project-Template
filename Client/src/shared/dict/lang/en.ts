export const sharedEn = {
	notFound: {
		heading: {
			title: "404 Not Found",
		},
		action: {
			goToHomePage: "Go to Home page",
		},
	},
	theme: {
		label: {
			light: "Light",
			dark: "Dark",
		},
		action: {
			switchToLight: "Switch to light mode",
			switchToDark: "Switch to dark mode",
		},
	},
	lang: {
		action: {
			switchToEnglish: "Switch to English",
			switchToFrench: "Switch to French",
		},
		status: {
			loading: "Loading language…",
		},
	},
	home: {
		heading: {
			title: "Home",
			subtitle: "A minimal React template.",
		},
		action: {
			openTodos: "Open todo list",
		},
	},
};

export type SharedTr = typeof sharedEn;
