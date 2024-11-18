import { ActionIcon } from "@mantine/core";
import { effect, signal } from "@preact/signals";
import { Lock, LockOpen } from "lucide-react";
import toast from "react-hot-toast";
import { gs } from "../context/GlobalState";
import { setWakeLock } from "../context/userActions";
import { widthSizeObj } from "../utils/clientUtils";

const isWakeLockAvailable = "wakeLock" in navigator || "keepAwake" in screen;

let showToasts = true;

// eslint-disable-next-line no-undef
let wakeLockObj: WakeLockSentinel | null = null;
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
						showToasts && toast("Automatic screen lock enabled", { icon: "🔓" });
						setWakeLock(false);
						wakeLockObj = null;
					});

					setWakeLock(true);
					showToasts && toast("Automatic screen lock disabled", { icon: "🔒" });
				})
				.catch((err) => {
					showToasts && console.error(err);
					isWakeLockLoading.value = false;
					showToasts && toast("Error while trying to keep screen locked on", { icon: "❌" });
				});
		}
	} else if ("keepAwake" in screen) {
		screen.keepAwake = !screen.keepAwake;
		setWakeLock(!!screen.keepAwake);
		if (screen.keepAwake) showToasts && toast("Automatic screen lock disabled", { icon: "🔒" });
		else showToasts && toast("Automatic screen lock enabled", { icon: "🔓" });
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

/**
 * The wake lock button
 * @returns the button to toggle the wake lock
 */
export const WakeLockButton = () => (
	<>
		{isWakeLockAvailable && (
			<ActionIcon loading={isWakeLockLoading.value} pb={1}>
				{gs.isWakeLock.value ? (
					<Lock onClick={toggleWakeLock} width={widthSizeObj(3.5, 6)} />
				) : (
					<LockOpen onClick={toggleWakeLock} width={widthSizeObj(3.5, 6)} />
				)}
			</ActionIcon>
		)}
	</>
);
