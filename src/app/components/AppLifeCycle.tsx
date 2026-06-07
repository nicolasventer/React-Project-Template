import { dict } from "@/app/dict";
import { colorScheme } from "@/app/logic/colorsScheme";
import { lang } from "@/app/logic/lang";
import { tr } from "@/app/logic/tr";
import { useEffect } from "react";

export const AppLifeCycle = () => {
	const langV = lang.data.use();

	// load the translations when the language changes
	useEffect(() => void dict[langV]().then(tr.data.setValue), [langV]);

	const colorSchemeV = colorScheme.data.use();
	// update the body class when the color scheme changes
	useEffect(() => document.documentElement.setAttribute("data-theme", colorSchemeV), [colorSchemeV]);

	return null;
};
