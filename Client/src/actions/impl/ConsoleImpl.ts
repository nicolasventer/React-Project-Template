import type { IConsole } from "@/actions/actions.interface";
import { state } from "@/actions/actions.state";
import type { ConsoleType, LogType } from "@/actions/actions.types";
import { computed } from "@preact/signals";
import type { MouseEventHandler, TouchEventHandler } from "react";

const closeHeight = computed(() => state.viewportSize.value.height * 0.05);
const openHeight = computed(() => state.viewportSize.value.height * 0.15);
const maxConsoleHeight = computed(() => state.viewportSize.value.height * 0.5);

export class ConsoleImpl implements IConsole {
	private oldConsoleLog = console.log;
	private oldConsoleInfo = console.info;
	private oldConsoleWarn = console.warn;
	private oldConsoleError = console.error;

	private mousePos = { x: 0, y: 0 };
	private startConsoleHeight = 0;

	private newConsoleLogFn =
		(type: LogType) =>
		(...args: unknown[]) =>
			this.log_add(
				type,
				args
					.map((arg) =>
						typeof arg === "string" ? arg : arg instanceof Error ? `${arg.message}\n${arg.stack}` : JSON.stringify(arg)
					)
					.join(" ")
			);

	private log_add = (type: LogType, message: string) => {
		state.console.log.list.push({
			type,
			message,
			time: new Date().toISOString().split("T")[1],
		});
		state.console.log.toSeeCount.value = state.console.log.toSeeCount.peek() + 1;
	};

	private height_updating = (ev: MouseEvent | TouchEvent) => {
		ev.stopPropagation();
		if (!state.console.isResizing.value) return;
		const clientY = ev instanceof MouseEvent ? ev.clientY : ev.touches[0].clientY;
		const newHeight = this.startConsoleHeight + this.mousePos.y - clientY;
		ConsoleImpl.HEIGHT_UPDATE(newHeight, this.startConsoleHeight);
	};

	private height_stopUpdating = (ev: MouseEvent | TouchEvent) => {
		ev.stopPropagation();
		state.console.isResizing.value = false;
		document.body.removeEventListener("mousemove", this.height_updating);
		document.body.removeEventListener("mouseup", this.height_stopUpdating);
		document.body.removeEventListener("touchmove", this.height_updating);
		document.body.removeEventListener("touchend", this.height_stopUpdating);
	};

	private static HEIGHT_UPDATE = (newHeight: number, startConsoleHeight: number) => {
		state.console.height.value = Math.max(openHeight.value, Math.min(maxConsoleHeight.value, newHeight));
		if (newHeight <= closeHeight.value) {
			state.console.isDisplayed.value = false;
			state.console.height.value = startConsoleHeight;
		} else if (newHeight >= openHeight.value) {
			state.console.isDisplayed.value = true;
		}
	};

	type = {
		update: (type: ConsoleType) => {
			if (type === "normal") {
				console.log = this.oldConsoleLog;
				console.info = this.oldConsoleInfo;
				console.warn = this.oldConsoleWarn;
				console.error = this.oldConsoleError;
			} else if (type === "custom") {
				console.log = this.newConsoleLogFn("log");
				console.info = this.newConsoleLogFn("info");
				console.warn = this.newConsoleLogFn("warn");
				console.error = this.newConsoleLogFn("error");
			} else {
				console.log = (...args: unknown[]) => (this.oldConsoleLog(...args), this.newConsoleLogFn("log")(...args));
				console.info = (...args: unknown[]) => (this.oldConsoleInfo(...args), this.newConsoleLogFn("info")(...args));
				console.warn = (...args: unknown[]) => (this.oldConsoleWarn(...args), this.newConsoleLogFn("warn")(...args));
				console.error = (...args: unknown[]) => (this.oldConsoleError(...args), this.newConsoleLogFn("error")(...args));
			}
		},
	};
	display = {
		toggle: () => {
			state.console.isDisplayed.value = !state.console.isDisplayed.value;
			if (state.console.isDisplayed.value) state.console.log.toSeeCount.value = 0;
		},
	};
	height = {
		startUpdating: ((ev) => {
			ev.stopPropagation();
			this.mousePos = "clientX" in ev ? { x: ev.clientX, y: ev.clientY } : { x: ev.touches[0].clientX, y: ev.touches[0].clientY };
			this.startConsoleHeight = state.console.height.value;
			state.console.isResizing.value = true;
			document.body.addEventListener("mousemove", this.height_updating);
			document.body.addEventListener("mouseup", this.height_stopUpdating);
			document.body.addEventListener("touchmove", this.height_updating);
			document.body.addEventListener("touchend", this.height_stopUpdating);
		}) satisfies MouseEventHandler<HTMLElement> & TouchEventHandler<HTMLElement>,
	};
	log = {
		clear: () => void (state.console.log.list.value = []),
		markAsReadFn: (index: number) => () =>
			void (state.console.log.toSeeCount.value = state.console.log.list.value.length - index - 1),
		wrap: {
			toggle: () => void (state.console.log.isWrapped.value = !state.console.log.isWrapped.value),
		},
	};
}
