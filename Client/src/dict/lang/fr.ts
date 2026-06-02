import type { Tr } from "./en";

export const fr: Tr = {
	notFound: {
		heading: {
			title: "404 Non trouvé",
		},
		action: {
			goToHomePage: "Aller à la page d'accueil",
		},
	},
	theme: {
		label: {
			light: "Clair",
			dark: "Sombre",
		},
		action: {
			switchToLight: "Passer en mode clair",
			switchToDark: "Passer en mode sombre",
		},
	},
	lang: {
		action: {
			switchToEnglish: "Passer en anglais",
			switchToFrench: "Passer en français",
		},
		status: {
			loading: "Chargement de la langue…",
		},
	},
	home: {
		heading: {
			title: "Accueil",
			subtitle: "Un modèle React minimal.",
		},
		action: {
			openTodos: "Ouvrir la liste des tâches",
		},
	},
	todo: {
		heading: {
			title: "Tâches",
		},
		form: {
			placeholder: "Que faut-il faire ?",
			searchPlaceholder: "Filtrer les tâches…",
		},
		label: {
			filter: {
				active: "Actives",
				all: "Toutes",
				completed: "Terminées",
			},
		},
		action: {
			add: "Ajouter",
			addRandom: "Ajouter au hasard",
			backHome: "Accueil",
			cancel: "Annuler",
			clearCompleted: "Effacer les terminées",
			delete: "Supprimer",
			edit: "Modifier",
			open: "Ouvrir",
			openLastOpened: "Dernière ouverte",
		},
		aria: {
			editTask: "Modifier la tâche : {title}",
			openTask: "Ouvrir la tâche : {title}",
		},
		status: {
			addRandomLoading: "Ajout…",
			addRandomFailed: "Impossible d'ajouter une tâche aléatoire.",
			itemsLeft: "{n} restante(s)",
			openLastOpenedNone: "Aucune tâche n'a encore été ouverte dans cette session.",
			noMatches: "Aucune tâche ne correspond au filtre.",
		},
	},
};
