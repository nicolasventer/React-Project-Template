import { app } from "@/globalState";

const updateIsAboveXl = (isAboveXl: boolean) => app.shell.isAboveXl.setValue(isAboveXl);
const updateIsAboveMd = (isAboveMd: boolean) => app.shell.isAboveMd.setValue(isAboveMd);

export const shell = {
	isAboveXl: { update: updateIsAboveXl },
	isAboveMd: { update: updateIsAboveMd },
};
