import { todoDict } from "@/features/todo/dict";
import { todoApp } from "@/features/todo/logic";
import { app } from "@/logic";
import { useEffect } from "react";

export const TodoLifeCycle = () => {
	const lang = app.lang.data.use();

	// load the translations when the language changes
	useEffect(() => void todoDict[lang]().then(todoApp.tr.data.setValue), [lang]);

	return null;
};
