import { actions } from "@/actions/actions.impl";
import { DarkModeButton } from "@/components/_app/DarkModeButton";
import { LanguageButton } from "@/components/_app/LanguageButton";
import type { Lang } from "@/dict";
import type { ImageViewType, LoginViewType } from "@/globalState";
import { appStore } from "@/globalState";
import type { RouterPathType } from "@/routerInstance.gen";
import { navigateToRouteFn } from "@/routerInstance.gen";
import type { ColorSchemeType, RoleType } from "@/Shared/SharedModel";
import type { Tr } from "@/tr/en";
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
		<Button onClick={actions.auth.isModalOpened.updateFn(true)} size="compact-md">
			Login
		</Button>
		<Modal title={tr[loginView]} opened={isModalOpened} onClose={actions.auth.isModalOpened.updateFn(false)}>
			<Vertical gap={12}>
				<TextInput
					label={tr["Email"]}
					required
					value={email}
					onChange={evStringFn(actions.auth.email.update)}
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
								<Anchor size="sm" mt={-2} onClick={actions.auth.loginView.updateFn("Forgot password?")}>
									{tr["Forgot password?"]}
								</Anchor>
							)}
						</Horizontal>
						<PasswordInput
							value={password}
							onChange={evStringFn(actions.auth.password.update)}
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
							<Anchor onClick={actions.auth.loginView.updateFn("Create account")}>{tr["Create account"]}</Anchor>
						</Horizontal>
					</>
				) : (
					<Horizontal justifyContent="space-between">
						<Anchor c="dimmed" size="sm">
							<Center inline>
								<ArrowLeft size={12} />
								<Box ml={5} onClick={actions.auth.loginView.updateFn("Login")}>
									{tr["Back to the login page"]}
								</Box>
							</Center>
						</Anchor>
						{loginView === "Forgot password?" && (
							<Button onClick={actions.auth.password.resetFn(email)}>{tr["Reset password"]}</Button>
						)}
						{loginView === "Create account" && (
							<Button onClick={actions.auth.account.createFn(email, password)}>{tr["Create account"]}</Button>
						)}
					</Horizontal>
				)}
			</Vertical>
		</Modal>
	</>
);

const ProfileMenu = ({ tr, role }: { tr: Tr; role: RoleType | null }) => (
	<Menu>
		<Menu.Target>
			<Button>{tr["Profile"]}</Button>
		</Menu.Target>
		<Menu.Dropdown>
			<Menu.Item onClick={navigateToRouteFn("/profile")}>{tr["Edit"]}</Menu.Item>
			{role === "admin" && <Menu.Item onClick={navigateToRouteFn("/users")}>{tr["Users"]}</Menu.Item>}
			<Menu.Divider />
			<Menu.Item c="red" onClick={actions.auth.logout}>
				{tr["Logout"]}
			</Menu.Item>
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
	role,
	currentRoute,
}: LoginModalProps & {
	isAuthenticated: boolean;
	lang: Lang;
	isLangLoading: boolean;
	colorScheme: ColorSchemeType;
	isColorSchemeLoading: boolean;
	role: RoleType | null;
	currentRoute: RouterPathType | undefined;
}) => (
	<Horizontal justifyContent="space-between">
		{currentRoute === "/" ? (
			<SegmentedControl
				data={[
					"Public",
					{
						value: "You",
						label: (
							<div data-tooltip-id="main-tooltip" data-tooltip-content={isAuthenticated ? "" : "Login to see your images"}>
								You
							</div>
						),
						disabled: !isAuthenticated,
					},
				]}
				value={appStore.use().imageView}
				onChange={(value) => actions.images.imageView.update(value as ImageViewType)}
			/>
		) : (
			<Button onClick={navigateToRouteFn("/")}>Images</Button>
		)}
		<Title>Pikilikee</Title>
		<Horizontal gap={12}>
			<LanguageButton lang={lang} isLoading={isLangLoading} useTransition={false} />
			<DarkModeButton isDark={colorScheme === "dark"} isLoading={isColorSchemeLoading} useTransition={false} />
			{isAuthenticated ? (
				<ProfileMenu tr={tr} role={role} />
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
		</Horizontal>
	</Horizontal>
);
