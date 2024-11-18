import { ActionIcon } from "@mantine/core";
import { signal } from "@preact/signals";
import { Moon, Sun } from "lucide-react";
import { gs } from "../context/GlobalState";
import { setColorSchemeFn } from "../context/userActions";
import { widthSizeObj } from "../utils/clientUtils";

const isColorSchemeLoading = signal(false);

/**
 * A button that toggles between light and dark mode
 * @param params
 * @param params.useTransition If the color scheme should change using a transition
 * @returns a button that toggles between light and dark mode
 */
export const DarkModeButton = ({ useTransition }: { useTransition: boolean }) => (
	<ActionIcon loading={isColorSchemeLoading.value}>
		{gs.colorScheme.value === "dark" && (
			<Sun
				width={widthSizeObj(3.5, 6)}
				id={"light-mode-button"}
				onClick={setColorSchemeFn("light", useTransition, isColorSchemeLoading)}
				style={{ marginBottom: 1 }}
			/>
		)}
		{gs.colorScheme.value === "light" && (
			<Moon
				width={widthSizeObj(3.5, 6)}
				id={"dark-mode-button"}
				onClick={setColorSchemeFn("dark", useTransition, isColorSchemeLoading)}
				style={{ marginBottom: 1 }}
			/>
		)}
	</ActionIcon>
);
