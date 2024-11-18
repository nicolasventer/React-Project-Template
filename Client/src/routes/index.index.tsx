import { Button } from "@mantine/core";
import { effect, signal } from "@preact/signals";
import { CustomConsole, setConsoleType } from "../components/CustomConsole";
import { DarkModeButton } from "../components/DarkModeButton";
import { LanguageButton } from "../components/LanguageButton";
import { WakeLockButton } from "../components/WakeLockButton";
import { tr } from "../context/GlobalState";

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
		{tr.v.Home}
		<Button onClick={toggleUseTransition}>{`${useTransition.value ? "Disable" : "Enable"} transition`}</Button>
		<DarkModeButton useTransition={useTransition.value} />
		<WakeLockButton />
		<LanguageButton useTransition={useTransition.value} />
		<CustomConsole resizable />
	</>
);
