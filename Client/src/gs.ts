import { globalState, type GlobalState, isLanguageLoading as isLanguageLoading_ } from "@/globalState";
import type { RecursiveReadOnlySignal } from "@/libs/StrongBox/signalUtils";
import type { ReadonlySignal } from "@preact/signals";

export { compactXsSm, loadGlobalState, LOCAL_STORAGE_KEY, smMd, tr, trDynFn, trFn, xsSm, type GlobalState } from "@/globalState";

/** The readonly global state of the application. */
export const gs = globalState as RecursiveReadOnlySignal<GlobalState>;

/** If the language is loading. */
export const isLanguageLoading = isLanguageLoading_ as ReadonlySignal<boolean>;
