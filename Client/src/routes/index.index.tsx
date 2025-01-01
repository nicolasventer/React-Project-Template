import { setConsoleType } from "@/features/_Common/CustomConsole/CustomConsole.utils";
import { DarkModeButton } from "@/features/_Common/DarkModeButton/DarkModeButton";
import { LanguageButton } from "@/features/_Common/LanguageButton/LanguageButton";
import { WakeLockButton } from "@/features/_Common/WakeLockButton/WakeLockButton";
import { tr, trDynFn } from "@/gs";
import { Button } from "@mantine/core";
import { effect, signal } from "@preact/signals";

const useTransition = signal(true);
const toggleUseTransition = () => (useTransition.value = !useTransition.value);

setConsoleType("custom");

effect(() => console.info("useTransition:", useTransition.value));

/**
 * Home page
 * @returns the home page
 */
export const HomePage = () => (
	<>
		<div>{tr.v.Home}</div>
		<div>{trDynFn("test")("dynamic_english")}</div>
		<Button onClick={toggleUseTransition}>{`${useTransition.value ? "Disable" : "Enable"} transition`}</Button>
		<DarkModeButton useTransition={useTransition.value} />
		<WakeLockButton />
		<LanguageButton useTransition={useTransition.value} />
	</>
);
