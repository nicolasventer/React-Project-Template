import { actions, st } from "@/actions/actions.impl";
import { responsiveSize } from "@/utils/clientUtils";
import { ActionIcon } from "@mantine/core";
import { Moon, Sun } from "lucide-react";

export const DarkModeButton = ({ useTransition }: { useTransition: boolean }) => (
	<ActionIcon loading={st.colorScheme.isLoading.value}>
		{st.colorScheme.current.value === "dark" && (
			<Sun
				width={responsiveSize(3.5, 6)}
				id={"light-mode-button"}
				onClick={actions.colorScheme.updateFn("light", useTransition)}
				style={{ marginBottom: 1 }}
			/>
		)}
		{st.colorScheme.current.value === "light" && (
			<Moon
				width={responsiveSize(3.5, 6)}
				id={"dark-mode-button"}
				onClick={actions.colorScheme.updateFn("dark", useTransition)}
				style={{ marginBottom: 1 }}
			/>
		)}
	</ActionIcon>
);
