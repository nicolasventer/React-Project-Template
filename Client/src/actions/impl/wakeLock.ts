import { setAppWithUpdate } from "@/globalState";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";

let isToastEnabled = true;
let wakeLockObj: WakeLockSentinel | null = null;

const updateWakeLockLoading = (isLoading: boolean) =>
	setAppWithUpdate("updateWakeLockLoading", [isLoading], (prev) => (prev.wakeLock.isLoading = isLoading));

const toggleWakeLock = () => {
	if ("wakeLock" in navigator) {
		if (wakeLockObj) {
			wakeLockObj.release();
			wakeLockObj = null;
			setAppWithUpdate("toggleWakeLock", [false], (prev) => (prev.wakeLock.isEnabled = false));
		} else {
			updateWakeLockLoading(true);
			navigator.wakeLock
				.request("screen")
				.then((wakeLock) => {
					wakeLockObj = wakeLock;
					setAppWithUpdate("toggleWakeLock", [true], (prev) => {
						prev.wakeLock.isLoading = false;
						prev.wakeLock.isEnabled = true;
					});

					wakeLockObj.addEventListener("release", () => {
						if (isToastEnabled) toast("Automatic screen lock enabled", { icon: "🔓" });
						setAppWithUpdate("toggleWakeLock", [false], (prev) => (prev.wakeLock.isEnabled = false));
						wakeLockObj = null;
					});

					if (isToastEnabled) toast("Automatic screen lock disabled", { icon: "🔒" });
				})
				.catch((err) => {
					if (isToastEnabled) console.error(err);
					updateWakeLockLoading(false);
					if (isToastEnabled) toast("Error while trying to keep screen locked on", { icon: "❌" });
				});
		}
	} else if ("keepAwake" in screen) {
		screen.keepAwake = !screen.keepAwake;
		const keepAwake = !!screen.keepAwake;
		setAppWithUpdate("toggleWakeLock", [keepAwake], (prev) => (prev.wakeLock.isEnabled = keepAwake));
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
