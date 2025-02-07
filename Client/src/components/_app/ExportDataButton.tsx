import { actions } from "@/actions/actions.impl";
import { ActionIcon } from "@mantine/core";
import { Save } from "lucide-react";

export const ExportDataButton = () => (
	<ActionIcon variant="transparent" onClick={actions.data.export}>
		<Save />
	</ActionIcon>
);
