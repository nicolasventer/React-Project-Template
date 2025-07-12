import { EditProfile } from "@/components/profile/EditProfile";
import { useApp, useTr } from "@/globalState";

export const Profile = () => {
	const app = useApp();
	const tr = useTr();
	const { auth, profile } = app;

	const userRole = auth.user.role;
	const userEmail = auth.user.email;
	const token = auth.token.get();
	const newPassword = profile.newPassword.get();
	const confirmNewPassword = profile.confirmNewPassword.get();
	const profileError = profile.error;
	const profileDeleteAccountButtonPressedAt = profile.deleteAccount.buttonPressedAt;
	const isProfileLoading = profile.isLoading;

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
