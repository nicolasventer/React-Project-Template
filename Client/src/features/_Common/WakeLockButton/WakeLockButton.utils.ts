import { setWakeLock } from "@/features/_Common/common.setters";
import { gs } from "@/gs";
import { effect, signal } from "@preact/signals";
import toast from "react-hot-toast";

let showToasts = true;

let wakeLockObj: WakeLockSentinel | null;
const isWakeLockLoading = signal(false);

/**
 * Toggles the wake lock
 */
export const toggleWakeLock = () => {
	if ("wakeLock" in navigator) {
		if (wakeLockObj) {
			wakeLockObj.release();
			wakeLockObj = null;
			setWakeLock(false);
		} else {
			isWakeLockLoading.value = true;
			navigator.wakeLock
				.request("screen")
				.then((wakeLock) => {
					wakeLockObj = wakeLock;
					isWakeLockLoading.value = false;

					wakeLockObj.addEventListener("release", () => {
						if (showToasts) toast("Automatic screen lock enabled", { icon: "🔓" });
						setWakeLock(false);
						wakeLockObj = null;
					});

					setWakeLock(true);
					if (showToasts) toast("Automatic screen lock disabled", { icon: "🔒" });
				})
				.catch((err) => {
					if (showToasts) console.error(err);
					isWakeLockLoading.value = false;
					if (showToasts) toast("Error while trying to keep screen locked on", { icon: "❌" });
				});
		}
	} else if ("keepAwake" in screen) {
		screen.keepAwake = !screen.keepAwake;
		setWakeLock(!!screen.keepAwake);
		if (showToasts) {
			if (screen.keepAwake) toast("Automatic screen lock disabled", { icon: "🔒" });
			else toast("Automatic screen lock enabled", { icon: "🔓" });
		}
	}
};

const isDocumentVisible = signal(document.visibilityState === "visible");
document.addEventListener("visibilitychange", () => (isDocumentVisible.value = document.visibilityState === "visible"));

/**
 * Automatically toggles the wake lock when the document is visible. (toasts are disabled)
 */
export const automaticWakeLock = () => {
	showToasts = false;
	effect(() => void (isDocumentVisible.value && !gs.isWakeLock.value && toggleWakeLock()));
};
