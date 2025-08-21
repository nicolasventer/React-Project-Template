import { EditProfile } from "@/components/profile/EditProfile";
import { app, useTr } from "@/globalState";

export const Profile = () => {
	const tr = useTr();

	const userRole = app.auth.user.role.use();
	const userEmail = app.auth.user.email.use();
	const token = app.auth.token.use();
	const newPassword = app.profile.newPassword.use();
	const confirmNewPassword = app.profile.confirmNewPassword.use();
	const profileError = app.profile.error.use();
	const profileDeleteAccountButtonPressedAt = app.profile.deleteAccount.buttonPressedAt.use();
	const isProfileLoading = app.profile.isLoading.use();

	return (
		<EditProfile
			tr={tr}
			userEmail={userEmail}
			userRole={userRole}
			newPassword={newPassword}
			confirmNewPassword={confirmNewPassword}
			token={token}
			profileError={profileError}
			profileDeleteAccountButtonPressedAt={profileDeleteAccountButtonPressedAt}
			isProfileLoading={isProfileLoading}
		/>
	);
};
