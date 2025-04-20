import { setAppWithUpdate } from "@/globalState";
import { throttleFn } from "@/Shared/SharedUtils";

const updateIsAboveXl = (isAboveXl: boolean) =>
	setAppWithUpdate("updateIsAboveXl", [isAboveXl], (prev) => (prev.shell.isAboveXl = isAboveXl));
const updateIsAboveMd = (isAboveMd: boolean) =>
	setAppWithUpdate("updateIsAboveMd", [isAboveMd], (prev) => (prev.shell.isAboveMd = isAboveMd));

const updateIsAsideOpened = (isOpened: boolean) =>
	setAppWithUpdate("updateIsAsideOpened", [isOpened], (prev) => (prev.shell.aside.isOpened = isOpened));
const updateIsNavbarOpened = (isOpened: boolean) =>
	setAppWithUpdate("updateIsNavbarOpened", [isOpened], (prev) => (prev.shell.navbar.isOpened = isOpened));

const updateIsMainScrollable = throttleFn(
	(isScrollable: boolean) =>
		setAppWithUpdate("updateIsMainScrollable", [isScrollable], (prev) => (prev.shell.main.isScrollable = isScrollable)),
	100
);

export const shell = {
	isAboveXl: { update: updateIsAboveXl },
	isAboveMd: { update: updateIsAboveMd },
	aside: { isOpened: { update: updateIsAsideOpened } },
	navbar: { isOpened: { update: updateIsNavbarOpened } },
	main: { isScrollable: { update: updateIsMainScrollable } },
};
