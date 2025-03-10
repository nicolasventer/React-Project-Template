import type { IActions, IColorScheme, IConsole, IData, ILanguage, IViewportSize, IWakeLock } from "@/actions/actions.interface";
import { state } from "@/actions/actions.state";
import { ColorSchemeImpl } from "@/actions/impl/ColorSchemeImpl";
import { ConsoleImpl } from "@/actions/impl/ConsoleImpl";
import { DataImpl } from "@/actions/impl/DataImpl";
import { LanguageImpl } from "@/actions/impl/LanguageImpl";
import { ViewportSizeImpl } from "@/actions/impl/ViewportSizeImpl";
import { WakeLockImpl } from "@/actions/impl/WakeLockImpl";
import { Events } from "@/utils/Events";
import type { RecursiveReadOnlySignal } from "@/utils/signalUtils";
import { computed } from "@preact/signals";

export const st = state as RecursiveReadOnlySignal<typeof state>;

const _computedSt = {
	isAboveMd: computed(() => st.viewportSize.value.width >= 992),
	isBelowXxs: computed(() => st.viewportSize.value.width <= 400),
	isWakeLockAvailable: "wakeLock" in navigator || "keepAwake" in screen,
};

const _computedSt2 = {
	smMd: computed(() => (_computedSt.isAboveMd.value ? "md" : "sm")),
	xsSm: computed(() => (_computedSt.isAboveMd.value ? "sm" : "xs")),
};

const _computedSt3 = {
	compactXsSm: computed(() => `compact-${_computedSt2.xsSm.value}`),
};

export const computedSt = Object.assign(_computedSt, _computedSt2, _computedSt3);

type OmitKeys<Type, K extends keyof Type> = Omit<Type, K>;

// intermediate type useful to progressively implement the IActions interface
type IPartialActions = OmitKeys<IActions, never>;
class Actions implements IPartialActions {
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
export const events = new Events({
	onPageLoad: [],
	intervals: {},
	onDataChange: [],
});
