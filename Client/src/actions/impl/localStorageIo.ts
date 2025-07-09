import { loadLocalStorageState, LOCAL_STORAGE_KEY, localStorageStateStore, setAppWithUpdate } from "@/globalState";
import { saveAs } from "@/utils/clientUtils";
import toast from "react-hot-toast";

const IMPORT_DATA = (readData: string, onSuccess: () => void) => {
	try {
		const data = JSON.parse(readData); // check that readData is a JSON string
		localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(data));
		const newLocalStorageState = loadLocalStorageState();
		setAppWithUpdate("importLocalStorageState", (prev) => {
			prev.colorScheme.value = newLocalStorageState.colorScheme;
			prev.lang.value = newLocalStorageState.lang;
		});
		onSuccess();
	} catch (error) {
		console.error(error);
	}
};

const importFn = (bRefreshPage: boolean) => (file: File | null) => {
	if (!file) return;
	const reader = new FileReader();
	reader.onload = () => {
		IMPORT_DATA(reader.result as string, () => {
			if (bRefreshPage) {
				toast.success("Data imported successfully,\nrefreshing page...");
				setTimeout(() => window.location.reload(), 2000);
			} else toast.success("Data imported successfully");
		});
	};
	reader.readAsText(file);
};

const export_ = () =>
	saveAs(
		new Blob([JSON.stringify(localStorageStateStore.private.value)], { type: "application/json" }),
		`${LOCAL_STORAGE_KEY}.json`
	);

export const localStorageIo = {
	importFn,
	export: export_,
};
