import type { IActions, IColorScheme, IConsole, IData, ILanguage, IViewportSize, IWakeLock } from "@/actions/actions.interface";
import { state } from "@/actions/actions.state";
import { ColorSchemeImpl } from "@/actions/impl/ColorSchemeImpl";
import { ConsoleImpl } from "@/actions/impl/ConsoleImpl";
import { DataImpl } from "@/actions/impl/DataImpl";
import { LanguageImpl } from "@/actions/impl/LanguageImpl";
import { ViewportSizeImpl } from "@/actions/impl/ViewportSizeImpl";
import { WakeLockImpl } from "@/actions/impl/WakeLockImpl";
import type { RecursiveReadOnlySignal } from "@/utils/signalUtils";
import { computed } from "@preact/signals";

export const st = state as RecursiveReadOnlySignal<typeof state>;

export const computedSt = {
	isAboveMd: computed(() => st.viewportSize.value.width >= 992),
	isBelowXxs: computed(() => st.viewportSize.value.width <= 400),
	isWakeLockAvailable: "wakeLock" in navigator || "keepAwake" in screen,
};

export const computedSt2 = {
	smMd: computed(() => (computedSt.isAboveMd.value ? "md" : "sm")),
	xsSm: computed(() => (computedSt.isAboveMd.value ? "sm" : "xs")),
};

export const computedSt3 = {
	compactXsSm: computed(() => `compact-${computedSt2.xsSm.value}`),
};

class Actions implements IActions {
	constructor(
		public colorScheme: IColorScheme,
		public language: ILanguage,
		public console: IConsole,
		public wakeLock: IWakeLock,
		public viewportSize: IViewportSize,
		public data: IData
	) {}
}

export const actions: IActions = new Actions(
	new ColorSchemeImpl(),
	new LanguageImpl(),
	new ConsoleImpl(),
	new WakeLockImpl(),
	new ViewportSizeImpl(),
	new DataImpl()
);
