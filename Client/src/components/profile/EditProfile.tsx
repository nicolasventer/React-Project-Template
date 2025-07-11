import { actions } from "@/actions/actions.impl";
import type { RoleType } from "@/Shared/SharedModel";
import type { Tr } from "@/tr/en";
import { Vertical } from "@/utils/ComponentToolbox";
import { Alert, Button, Divider, PasswordInput, Text, Title } from "@mantine/core";
import { InfoIcon } from "lucide-react";

export const EditProfile = ({
	tr,
	userEmail,
	userRole,
	newPassword,
	confirmNewPassword,
	token,
	profileError,
}: {
	tr: Tr;
	userEmail: string;
	userRole: RoleType | null;
	newPassword: string;
	confirmNewPassword: string;
	token: string;
	profileError: string;
}) => (
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
			onChange={(e) => actions.profile.newPassword.update(e.target.value)}
		/>
		<PasswordInput
			label={tr["Confirm new password"]}
			value={confirmNewPassword}
			onChange={(e) => actions.profile.confirmNewPassword.update(e.target.value)}
		/>
		<Button onClick={actions.profile.confirmPasswordFn(newPassword, confirmNewPassword, token)}>{tr["Confirm password"]}</Button>
		<Vertical gap={12} marginTop={24}>
			<Divider />
			<Button color="red">Delete Account</Button>
		</Vertical>
	</Vertical>
);
