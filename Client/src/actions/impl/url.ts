import { setAppWithUpdate } from "@/globalState";

const updateUrl = (url: string) => setAppWithUpdate("updateUrl", [url], (prev) => (prev.url = url));

export const url = {
	update: updateUrl,
};
