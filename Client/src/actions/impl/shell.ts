import { setAppWithUpdate } from "@/globalState";

const updateIsAboveXl = (isAboveXl: boolean) =>
	setAppWithUpdate("updateIsAboveXl", [isAboveXl], (prev) => (prev.shell.isAboveXl = isAboveXl));
const updateIsAboveMd = (isAboveMd: boolean) =>
	setAppWithUpdate("updateIsAboveMd", [isAboveMd], (prev) => (prev.shell.isAboveMd = isAboveMd));

export const shell = {
	updateIsAboveXl,
	updateIsAboveMd,
};
