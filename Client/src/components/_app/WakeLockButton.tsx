import { actions } from "@/actions/actions.impl";
import { app } from "@/globalState";
import { responsiveSize } from "@/utils/clientUtils";
import { ActionIcon } from "@mantine/core";
import { Lock, LockOpen } from "lucide-react";

const isWakeLockAvailable = "wakeLock" in navigator || "keepAwake" in screen;

export const WakeLockButton = () => {
	const isLoading = app.wakeLock.isLoading.use();
	const isWakeLockEnabled = app.wakeLock.isEnabled.use();

	const Icon = isWakeLockEnabled ? Lock : LockOpen;

	return (
		<>
			{isWakeLockAvailable && (
				<ActionIcon loading={isLoading} pb={1}>
					<Icon onClick={actions.wakeLock.toggle} width={responsiveSize(3.5, 6)} />
				</ActionIcon>
			)}
		</>
	);
};
