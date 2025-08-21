import { app } from "@/globalState";

const updateUrl = (url: string) => app.url.setValue(url);

export const url = {
	update: updateUrl,
};
