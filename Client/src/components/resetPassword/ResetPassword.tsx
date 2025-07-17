import { actions } from "@/actions/actions.impl";
import { evStringFn } from "@/utils/clientUtils";
import { Vertical } from "@/utils/ComponentToolbox";
import { Button, PasswordInput, TextInput, Title } from "@mantine/core";

export const ResetPassword = ({
	token,
	inputToken,
	newPassword,
	isResetPasswordLoading,
	resetPasswordError,
}: {
	token: string | undefined;
	inputToken: string;
	newPassword: string;
	isResetPasswordLoading: boolean;
	resetPasswordError: string;
}) => (
	<Vertical gap={12}>
		<Title order={2}>Reset Password</Title>
		{!token && (
			<TextInput
				label="Token"
				value={inputToken}
				onChange={evStringFn(actions.resetPassword.inputToken.update)}
				disabled={isResetPasswordLoading}
				error={!!resetPasswordError}
			/>
		)}
		<PasswordInput
			label="New Password"
			value={newPassword}
			onChange={evStringFn(actions.resetPassword.newPassword.update)}
			disabled={isResetPasswordLoading}
			error={resetPasswordError}
		/>
		<Button onClick={actions.resetPassword.password.resetFn(token ?? inputToken, newPassword)} disabled={isResetPasswordLoading}>
			Reset Password
		</Button>
	</Vertical>
);
