import { actions, computedSt, st } from "@/actions/actions.impl";
import { responsiveSize } from "@/utils/clientUtils";
import { ActionIcon } from "@mantine/core";
import { Lock, LockOpen } from "lucide-react";

export const WakeLockButton = () => (
	<>
		{computedSt.isWakeLockAvailable && (
			<ActionIcon loading={st.wakeLock.isLoading.value} pb={1}>
				{st.wakeLock.isEnabled.value ? (
					<Lock onClick={actions.wakeLock.toggle} width={responsiveSize(3.5, 6)} />
				) : (
					<LockOpen onClick={actions.wakeLock.toggle} width={responsiveSize(3.5, 6)} />
				)}
			</ActionIcon>
		)}
	</>
);
