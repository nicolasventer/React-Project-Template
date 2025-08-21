import { actions } from "@/actions/actions.impl";
import { app } from "@/globalState";
import { responsiveSize } from "@/utils/clientUtils";
import { ActionIcon } from "@mantine/core";
import { Moon, Sun } from "lucide-react";

export const DarkModeButton = ({ useTransition }: { useTransition: boolean }) => {
	const isDark = app.colorScheme.data.use() === "dark";
	const isLoading = app.colorScheme.isLoading.use();

	const Icon = isDark ? Sun : Moon;

	return (
		<ActionIcon loading={isLoading} variant="light">
			<Icon
				width={responsiveSize(3.5, 6)}
				id={isDark ? "light-mode-button" : "dark-mode-button"}
				onClick={actions.colorScheme.updateFn(isDark ? "light" : "dark", useTransition)}
				style={{ marginBottom: 1 }}
			/>
		</ActionIcon>
	);
};
