import { gs } from "@/gs";
import { computed } from "@preact/signals";

// CustomConsole

/** The height from which the console is closed. */
export const closeHeight = computed(() => gs.viewportSize.value.height * 0.05);
/** The height from which the console is opened. */
export const openHeight = computed(() => gs.viewportSize.value.height * 0.15);
/** The maximum height of the console. */
export const maxConsoleHeight = computed(() => gs.viewportSize.value.height * 0.5);
