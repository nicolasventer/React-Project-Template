import { app } from "@/globalState";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";

let isToastEnabled = true;
let wakeLockObj: WakeLockSentinel | null = null;

const toggleWakeLock = () => {
	if ("wakeLock" in navigator) {
		if (wakeLockObj) {
			wakeLockObj.release();
			wakeLockObj = null;
			app.wakeLock.isEnabled.setValue(false);
		} else {
			app.wakeLock.isLoading.setValue(true);
			navigator.wakeLock
				.request("screen")
				.then((wakeLock) => {
					wakeLockObj = wakeLock;
					app.wakeLock.isEnabled.setValue(true);
					app.wakeLock.isLoading.setValue(false);

					wakeLockObj.addEventListener("release", () => {
						if (isToastEnabled) toast("Automatic screen lock enabled", { icon: "🔓" });
						app.wakeLock.isEnabled.setValue(false);
						wakeLockObj = null;
					});

					if (isToastEnabled) toast("Automatic screen lock disabled", { icon: "🔒" });
				})
				.catch((err) => {
					if (isToastEnabled) console.error(err);
					app.wakeLock.isLoading.setValue(false);
					if (isToastEnabled) toast("Error while trying to keep screen locked on", { icon: "❌" });
				});
		}
	} else if ("keepAwake" in screen) {
		screen.keepAwake = !screen.keepAwake;
		const keepAwake = !!screen.keepAwake;
		app.wakeLock.isEnabled.setValue(keepAwake);
		if (isToastEnabled) {
			if (keepAwake) toast("Automatic screen lock disabled", { icon: "🔒" });
			else toast("Automatic screen lock enabled", { icon: "🔓" });
		}
	}
};

const useWakeLockAutomaticEnable = ({ isWakeLockEnabled }: { isWakeLockEnabled: boolean }) => {
	const [isDocumentVisible, setIsDocumentVisible] = useState(true);

	useEffect(() => {
		isToastEnabled = false;
		const { signal, abort } = new AbortController();
		document.addEventListener("visibilitychange", () => setIsDocumentVisible(document.visibilityState === "visible"), { signal });
		return abort;
	}, []);

	useEffect(() => {
		if (isDocumentVisible && !isWakeLockEnabled) toggleWakeLock();
	}, [isDocumentVisible, isWakeLockEnabled]);
};

export const wakeLock = {
	useAutomaticEnable: useWakeLockAutomaticEnable,
	toggle: toggleWakeLock,
};
