import { actions } from "@/actions/actions.impl";
import { FileInput } from "@mantine/core";
import { FileJson } from "lucide-react";

export const ImportDataButton = () => (
	<FileInput
		label="Import data"
		accept="application/json"
		placeholder="Click to import data or drag and drop file"
		rightSection={<FileJson />}
		onChange={actions.localStorageIo.importFn(false)}
		value={null}
	/>
);
