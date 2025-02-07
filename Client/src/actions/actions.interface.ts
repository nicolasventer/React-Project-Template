import type { ConsoleType, ViewportSize } from "@/actions/actions.types";
import type { ColorSchemeType, LanguageType } from "@/Shared/SharedModel";
import type { MouseEventHandler, TouchEventHandler } from "react";

export type IActions = {
	colorScheme: { updateFn: (colorScheme: ColorSchemeType, useTransition: boolean) => () => void };
	language: { updateFn: (language: LanguageType, useTransition: boolean) => () => void };
	console: {
		type: { update: (type: ConsoleType) => void };
		display: { toggle: () => void };
		height: { startUpdating: MouseEventHandler<HTMLElement> & TouchEventHandler<HTMLElement> };
		log: {
			clear: () => void;
			markAsReadFn: (index: number) => () => void;
			wrap: { toggle: () => void };
		};
	};
	wakeLock: {
		automaticEnable: () => void;
		toggle: () => void;
	};
	viewportSize: { update: (viewportSize: ViewportSize) => void };
	data: {
		import: (file: File | null) => void;
		export: () => void;
	};
};

export type IColorScheme = IActions["colorScheme"];
export type ILanguage = IActions["language"];
export type IConsole = IActions["console"];
export type IWakeLock = IActions["wakeLock"];
export type IViewportSize = IActions["viewportSize"];
export type IData = IActions["data"];
