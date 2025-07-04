import { actions } from "@/actions/actions.impl";
import { responsiveSize } from "@/utils/clientUtils";
import { ActionIcon } from "@mantine/core";
import { Moon, Sun } from "lucide-react";

export const DarkModeButton = ({
	isDark,
	isLoading,
	useTransition,
}: {
	isDark: boolean;
	isLoading: boolean;
	useTransition: boolean;
}) => (
	<ActionIcon loading={isLoading} variant="light">
		{isDark ? (
			<Sun
				width={responsiveSize(3.5, 6)}
				id={"light-mode-button"}
				onClick={actions.colorScheme.updateFn("light", useTransition)}
				style={{ marginBottom: 1 }}
			/>
		) : (
			<Moon
				width={responsiveSize(3.5, 6)}
				id={"dark-mode-button"}
				onClick={actions.colorScheme.updateFn("dark", useTransition)}
				style={{ marginBottom: 1 }}
			/>
		)}
	</ActionIcon>
);
