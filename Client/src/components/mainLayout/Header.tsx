import { actions } from "@/actions/actions.impl";
import { DarkModeButton } from "@/components/_app/DarkModeButton";
import { LanguageButton } from "@/components/_app/LanguageButton";
import type { Lang } from "@/dict";
import { appStore } from "@/globalState";
import type { ColorSchemeType } from "@/Shared/SharedModel";
import type { Tr } from "@/tr/en";
import type { LoginViewType } from "@/types";
import { evStringFn } from "@/utils/clientUtils";
import { Horizontal, Vertical } from "@/utils/ComponentToolbox";
import {
	Anchor,
	Box,
	Button,
	Center,
	Divider,
	InputLabel,
	Menu,
	Modal,
	PasswordInput,
	SegmentedControl,
	Text,
	TextInput,
	Title,
} from "@mantine/core";
import { ArrowLeft } from "lucide-react";

type LoginModalProps = {
	email: string;
	password: string;
	authError: string;
	tr: Tr;
	isModalOpened: boolean;
	isAuthLoading: boolean;
	loginView: LoginViewType;
};

const LoginModal = ({ email, password, authError, tr, isModalOpened, isAuthLoading, loginView }: LoginModalProps) => (
	<>
		<Button onClick={actions.auth.updateIsModalOpenedFn(true)} size="compact-md">
			Login
		</Button>
		<Modal title={tr[loginView]} opened={isModalOpened} onClose={actions.auth.updateIsModalOpenedFn(false)}>
			<Vertical gap={12}>
				<TextInput
					label={tr["Email"]}
					required
					value={email}
					onChange={evStringFn(actions.auth.updateEmail)}
					error={!!authError}
					disabled={isAuthLoading}
				/>
				{loginView !== "Forgot password?" && (
					<>
						<Horizontal justifyContent="space-between" alignItems="baseline">
							<Horizontal gap={4}>
								<InputLabel>{tr["Password"]}</InputLabel>
								<Text c="var(--mantine-color-error)">*</Text>
							</Horizontal>
							{loginView === "Login" && (
								<Anchor size="sm" mt={-2} onClick={actions.auth.updateLoginViewFn("Forgot password?")}>
									{tr["Forgot password?"]}
								</Anchor>
							)}
						</Horizontal>
						<PasswordInput
							value={password}
							onChange={evStringFn(actions.auth.updatePassword)}
							error={authError}
							disabled={isAuthLoading}
						/>
					</>
				)}
				{loginView === "Login" ? (
					<>
						<Button onClick={actions.auth.loginFn(email, password)} loading={isAuthLoading}>
							{tr["Sign in"]}
						</Button>
						<Divider my={6} />
						<Horizontal gap={4}>
							<Text c="dimmed" size="sm">
								{tr["No account yet?"]}
							</Text>
							<Anchor onClick={actions.auth.updateLoginViewFn("Create account")}>{tr["Create account"]}</Anchor>
						</Horizontal>
					</>
				) : (
					<Horizontal justifyContent="space-between">
						<Anchor c="dimmed" size="sm">
							<Center inline>
								<ArrowLeft size={12} />
								<Box ml={5} onClick={actions.auth.updateLoginViewFn("Login")}>
									{tr["Back to the login page"]}
								</Box>
							</Center>
						</Anchor>
						{loginView === "Forgot password?" && (
							<Button onClick={actions.auth.resetPasswordFn(email)}>{tr["Reset password"]}</Button>
						)}
						{loginView === "Create account" && (
							<Button onClick={actions.auth.createAccountFn(email, password)}>{tr["Create account"]}</Button>
						)}
					</Horizontal>
				)}
			</Vertical>
		</Modal>
	</>
);

const ProfileMenu = ({ tr }: { tr: Tr }) => (
	<Menu>
		<Menu.Target>
			<Button>{tr["Profile"]}</Button>
		</Menu.Target>
		<Menu.Dropdown>
			<Menu.Item>{tr["Edit"]}</Menu.Item>
			<Menu.Divider />
			<Menu.Item c="red">{tr["Logout"]}</Menu.Item>
		</Menu.Dropdown>
	</Menu>
);

export const Header = ({
	isAuthenticated,
	tr,
	isModalOpened,
	email,
	password,
	authError,
	isAuthLoading,
	loginView,
	lang,
	isLangLoading,
	colorScheme,
	isColorSchemeLoading,
}: LoginModalProps & {
	isAuthenticated: boolean;
	lang: Lang;
	isLangLoading: boolean;
	colorScheme: ColorSchemeType;
	isColorSchemeLoading: boolean;
}) => (
	<Horizontal justifyContent="space-between">
		<SegmentedControl
			data={["Public", { value: "You", label: "You", disabled: !isAuthenticated }]}
			value={appStore.use().imageView}
			onChange={actions.images.view.update}
		/>
		<Title>Pikilikee</Title>
		<Horizontal gap={12}>
			{isAuthenticated ? (
				<ProfileMenu tr={tr} />
			) : (
				<LoginModal
					tr={tr}
					isModalOpened={isModalOpened}
					email={email}
					password={password}
					authError={authError}
					isAuthLoading={isAuthLoading}
					loginView={loginView}
				/>
			)}
			<LanguageButton lang={lang} isLoading={isLangLoading} useTransition={false} />
			<DarkModeButton isDark={colorScheme === "dark"} isLoading={isColorSchemeLoading} useTransition={false} />
		</Horizontal>
	</Horizontal>
);
