export const en = {
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
	todo: {
		heading: {
			title: "Todos",
		},
		form: {
			placeholder: "What needs to be done?",
			searchPlaceholder: "Filter tasks…",
		},
		label: {
			filter: {
				active: "Active",
				all: "All",
				completed: "Done",
			},
		},
		action: {
			add: "Add",
			addRandom: "Add random",
			backHome: "Home",
			cancel: "Cancel",
			clearCompleted: "Clear completed",
			delete: "Delete",
			edit: "Edit",
			open: "Open",
			openLastOpened: "Last opened",
		},
		aria: {
			editTask: "Edit task: {title}",
			openTask: "Open task: {title}",
		},
		status: {
			addRandomLoading: "Adding…",
			addRandomFailed: "Could not add a random task.",
			itemsLeft: "{n} left",
			openLastOpenedNone: "No todo has been opened yet in this session.",
			noMatches: "No tasks match your filter.",
		},
	},
};

export type Tr = typeof en;
