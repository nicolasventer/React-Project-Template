import type { TodoTr } from "./en";

export const todoFr: TodoTr = {
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
