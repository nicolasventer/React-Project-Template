import { dict } from "@/features/timer/dict";
import { tr } from "@/features/timer/logic/tr";
import { lang } from "@/shared/logic/lang";
import { useEffect } from "react";

export const TimerLifeCycle = () => {
	const langV = lang.data.use();

	useEffect(() => void dict[langV]().then(tr.data.setValue), [langV]);

	return null;
};
