import type { IWakeLock } from "@/actions/actions.interface";
import { state } from "@/actions/actions.state";
import { effect, signal } from "@preact/signals";
import toast from "react-hot-toast";

export class WakeLockImpl implements IWakeLock {
	private isDocumentVisible = signal(document.visibilityState === "visible");
	private isToastEnabled = true;
	private wakeLockObj: WakeLockSentinel | null = null;

	constructor() {
		document.addEventListener("visibilitychange", () => (this.isDocumentVisible.value = document.visibilityState === "visible"));
	}

	_automaticEnable = () => {
		this.isToastEnabled = false;
		effect(() => {
			if (this.isDocumentVisible.value && !state.wakeLock.isEnabled.value) this.toggle();
		});
	};

	toggle = () => {
		if ("wakeLock" in navigator) {
			if (this.wakeLockObj) {
				this.wakeLockObj.release();
				this.wakeLockObj = null;
				state.wakeLock.isEnabled.value = false;
			} else {
				state.wakeLock.isLoading.value = true;
				navigator.wakeLock
					.request("screen")
					.then((wakeLock) => {
						this.wakeLockObj = wakeLock;
						state.wakeLock.isLoading.value = false;

						this.wakeLockObj.addEventListener("release", () => {
							if (this.isToastEnabled) toast("Automatic screen lock enabled", { icon: "🔓" });
							state.wakeLock.isEnabled.value = false;
							this.wakeLockObj = null;
						});

						state.wakeLock.isEnabled.value = true;
						if (this.isToastEnabled) toast("Automatic screen lock disabled", { icon: "🔒" });
					})
					.catch((err) => {
						if (this.isToastEnabled) console.error(err);
						state.wakeLock.isLoading.value = false;
						if (this.isToastEnabled) toast("Error while trying to keep screen locked on", { icon: "❌" });
					});
			}
		} else if ("keepAwake" in screen) {
			screen.keepAwake = !screen.keepAwake;
			state.wakeLock.isEnabled.value = !!screen.keepAwake;
			if (this.isToastEnabled) {
				if (screen.keepAwake) toast("Automatic screen lock disabled", { icon: "🔒" });
				else toast("Automatic screen lock enabled", { icon: "🔓" });
			}
		}
	};
}
