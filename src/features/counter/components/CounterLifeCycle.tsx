import { dict } from "@/features/counter/dict";
import { tr } from "@/features/counter/logic/tr";
import { lang } from "@/shared/logic/lang";
import { useEffect } from "react";

export const CounterLifeCycle = () => {
	const langV = lang.data.use();

	useEffect(() => void dict[langV]().then(tr.data.setValue), [langV]);

	return null;
};
