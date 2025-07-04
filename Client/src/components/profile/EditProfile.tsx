import { actions } from "@/actions/actions.impl";
import type { RoleType } from "@/Shared/SharedModel";
import type { Tr } from "@/tr/en";
import { evStringFn } from "@/utils/clientUtils";
import { Vertical } from "@/utils/ComponentToolbox";
import { useInterval } from "@/utils/useInterval";
import { Alert, Button, Divider, Modal, PasswordInput, Text, Title } from "@mantine/core";
import { InfoIcon } from "lucide-react";
import { useState } from "react";

export const EditProfile = ({
	tr,
	userEmail,
	userRole,
	newPassword,
	confirmNewPassword,
	token,
	profileError,
	profileDeleteAccountButtonPressedAt,
	isProfileLoading,
}: {
	tr: Tr;
	userEmail: string;
	userRole: RoleType | null;
	newPassword: string;
	confirmNewPassword: string;
	token: string;
	profileError: string;
	profileDeleteAccountButtonPressedAt: number | null;
	isProfileLoading: boolean;
}) => {
	const [remainingTime, setRemainingTime] = useState(0);
	useInterval(
		() => {
			if (profileDeleteAccountButtonPressedAt)
				setRemainingTime(Math.max(0, 5000 - (Date.now() - profileDeleteAccountButtonPressedAt)));
		},
		1000,
		profileDeleteAccountButtonPressedAt !== null
	);

	return (
		<Vertical marginTop={12} gap={6}>
			{profileError && (
				<Alert color="red" icon={<InfoIcon />}>
					{profileError}
				</Alert>
			)}
			<Title order={2}>{tr["Profile"]}</Title>
			<Text>
				<b>{tr["Email"]}:</b> {userEmail}
			</Text>
			<Text>
				<b>{tr["Role"]}:</b> {userRole}
			</Text>
			<PasswordInput
				label={tr["New password"]}
				value={newPassword}
				onChange={evStringFn(actions.profile.newPassword.update)}
				disabled={isProfileLoading}
			/>
			<PasswordInput
				label={tr["Confirm new password"]}
				value={confirmNewPassword}
				onChange={evStringFn(actions.profile.confirmNewPassword.update)}
				disabled={isProfileLoading}
			/>
			<Button onClick={actions.profile.password.confirmFn(newPassword, confirmNewPassword, token)} loading={isProfileLoading}>
				{tr["Confirm password"]}
			</Button>
			<Vertical gap={12} marginTop={24}>
				<Divider />
				<Button color="red" onClick={actions.profile.deleteAccount.pressButton} disabled={isProfileLoading}>
					Delete Account
				</Button>
			</Vertical>
			<Modal
				opened={profileDeleteAccountButtonPressedAt !== null}
				onClose={actions.profile.deleteAccount.cancelButton}
				title="Delete Account"
			>
				<Vertical gap={12}>
					<Text>Are you sure you want to delete your account?</Text>
					<Button
						color="red"
						onClick={actions.profile.deleteAccount.executeFn(token)}
						disabled={remainingTime > 0}
						loading={isProfileLoading}
					>
						Delete Account {remainingTime > 0 && `(${Math.ceil(remainingTime / 1000)}s)`}
					</Button>
				</Vertical>
			</Modal>
		</Vertical>
	);
};
