import { toggleWakeLock } from "@/features/_Common/WakeLockButton/WakeLockButton.utils";
import { gs } from "@/gs";
import { widthSizeObj } from "@/libs/StrongBox/clientUtils";
import { ActionIcon } from "@mantine/core";
import { signal } from "@preact/signals";
import { Lock, LockOpen } from "lucide-react";

const isWakeLockAvailable = "wakeLock" in navigator || "keepAwake" in screen;

const isWakeLockLoading = signal(false);

const isDocumentVisible = signal(document.visibilityState === "visible");
document.addEventListener("visibilitychange", () => (isDocumentVisible.value = document.visibilityState === "visible"));

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
