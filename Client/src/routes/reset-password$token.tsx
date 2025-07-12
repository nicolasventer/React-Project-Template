import { ResetPassword } from "@/components/resetPassword/ResetPassword";
import { useApp } from "@/globalState";
import { useRouteParams } from "@/routerInstance.gen";

export const ResetPasswordPage = () => {
	const { token } = useRouteParams("/reset-password?token");
	const { resetPassword } = useApp();

	const newPassword = resetPassword.newPassword.get();
	const isResetPasswordLoading = resetPassword.isLoading;
	const resetPasswordError = resetPassword.error;
	const inputToken = resetPassword.inputToken;

	return (
		<ResetPassword
			token={token}
			inputToken={inputToken}
			newPassword={newPassword}
			isResetPasswordLoading={isResetPasswordLoading}
			resetPasswordError={resetPasswordError}
		/>
	);
};
