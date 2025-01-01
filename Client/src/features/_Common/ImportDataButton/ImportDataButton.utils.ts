import { importData } from "@/features/_Common/common.setters";
import toast from "react-hot-toast";

/**
 * Handles the import of global state data from a JSON file.
 *
 * @param file - The file to be imported.
 */
export const onImportData = (file: File | null) => {
	if (!file) return;
	const reader = new FileReader();
	reader.onload = () => {
		importData(reader.result as string, () => {
			toast.success("Data imported successfully,\nrefreshing page...");
			setTimeout(() => window.location.reload(), 2000);
		});
	};
	reader.readAsText(file);
};
