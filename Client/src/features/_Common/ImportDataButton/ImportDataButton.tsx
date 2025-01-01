import { onImportData } from "@/features/_Common/ImportDataButton/ImportDataButton.utils";
import { FileInput } from "@mantine/core";
import { FileJson } from "lucide-react";

/**
 * A button component that allows users to import global state data from a JSON file.
 *
 * @returns A JSX element representing the import data button.
 */
export const ImportDataButton = () => (
	<FileInput
		label="Import data"
		accept="application/json"
		placeholder="Click to import data or drag and drop file"
		rightSection={<FileJson />}
		onChange={onImportData}
		value={null}
	/>
);
