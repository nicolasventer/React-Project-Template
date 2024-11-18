import { ActionIcon } from "@mantine/core";
import { Save } from "lucide-react";
import { gs, LOCAL_STORAGE_KEY } from "../context/GlobalState";
import { saveAs } from "../utils/clientUtils";
import { signalToValue } from "../utils/signalUtils";

/**
 * Exports the global state data as a JSON file with the key {@link LOCAL_STORAGE_KEY}`.json`.
 * The data is converted to a JSON string using the {@link signalToValue} function.
 */
const exportData = () =>
	saveAs(new Blob([JSON.stringify(signalToValue(gs))], { type: "application/json" }), `${LOCAL_STORAGE_KEY}.json`);

/**
 * A button component that triggers the export of global state data when clicked.
 *
 * @returns The rendered button component.
 */
export const ExportDataButton = () => (
	<ActionIcon variant="transparent" onClick={exportData}>
		<Save />
	</ActionIcon>
);
