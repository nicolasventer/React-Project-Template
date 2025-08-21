import { ResetPassword } from "@/components/resetPassword/ResetPassword";
import { app } from "@/globalState";
import { useRouteParams } from "@/routerInstance.gen";

export const ResetPasswordPage = () => {
	const { token } = useRouteParams("/reset-password?token");

	const newPassword = app.resetPassword.newPassword.use();
	const isResetPasswordLoading = app.resetPassword.isLoading.use();
	const resetPasswordError = app.resetPassword.error.use();
	const inputToken = app.resetPassword.inputToken.use();

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
