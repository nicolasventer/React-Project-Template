import type { IData } from "@/actions/actions.interface";
import { globalState } from "@/globalState";
import { loadGlobalState, LOCAL_STORAGE_KEY } from "@/gs";
import { saveAs } from "@/utils/clientUtils";
import { signalToValue } from "@/utils/signalUtils";
import toast from "react-hot-toast";

export class DataImpl implements IData {
	private static IMPORT_DATA = (readData: string, onSuccess: () => void) => {
		try {
			const data = JSON.parse(readData); // check that readData is a JSON string
			localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(data));
			const newGlobalState = loadGlobalState();
			Object.assign(globalState, newGlobalState);
			onSuccess();
		} catch (error) {
			console.error(error);
		}
	};

	import = (file: File | null) => {
		if (!file) return;
		const reader = new FileReader();
		reader.onload = () => {
			DataImpl.IMPORT_DATA(reader.result as string, () => {
				toast.success("Data imported successfully,\nrefreshing page...");
				setTimeout(() => window.location.reload(), 2000);
			});
		};
		reader.readAsText(file);
	};

	export = () =>
		saveAs(new Blob([JSON.stringify(signalToValue(globalState))], { type: "application/json" }), `${LOCAL_STORAGE_KEY}.json`);
}
