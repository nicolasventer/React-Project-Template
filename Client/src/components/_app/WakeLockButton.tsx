import { actions } from "@/actions/actions.impl";
import { responsiveSize } from "@/utils/clientUtils";
import { ActionIcon } from "@mantine/core";
import { Lock, LockOpen } from "lucide-react";

const isWakeLockAvailable = "wakeLock" in navigator || "keepAwake" in screen;

export const WakeLockButton = ({
	isWakeLockEnabled,
	isWakeLockLoading,
}: {
	isWakeLockEnabled: boolean;
	isWakeLockLoading: boolean;
}) => (
	<>
		{isWakeLockAvailable && (
			<ActionIcon loading={isWakeLockLoading} pb={1}>
				{isWakeLockEnabled ? (
					<Lock onClick={actions.wakeLock.toggle} width={responsiveSize(3.5, 6)} />
				) : (
					<LockOpen onClick={actions.wakeLock.toggle} width={responsiveSize(3.5, 6)} />
				)}
			</ActionIcon>
		)}
	</>
);
