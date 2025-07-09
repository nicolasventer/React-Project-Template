import { actions } from "@/actions/actions.impl";
import { appStore } from "@/globalState";
import type { Tr } from "@/tr/en";
import { evStringFn } from "@/utils/clientUtils";
import { Horizontal, Vertical } from "@/utils/ComponentToolbox";
import {
	Anchor,
	Button,
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

type LoginModalProps = {
	email: string;
	password: string;
	authError: string;
	tr: Tr;
	isModalOpened: boolean;
	isAuthLoading: boolean;
};

const LoginModal = ({ email, password, authError, tr, isModalOpened, isAuthLoading }: LoginModalProps) => (
	<>
		<Button onClick={actions.auth.updateIsModalOpenedFn(true)}>Login</Button>
		<Modal title="Login" opened={isModalOpened} onClose={actions.auth.updateIsModalOpenedFn(false)}>
			<Vertical gap={12}>
				<TextInput
					label={tr["Email"]}
					required
					value={email}
					onChange={evStringFn(actions.auth.updateEmail)}
					error={!!authError}
					disabled={isAuthLoading}
				/>
				<Horizontal justifyContent="space-between" alignItems="baseline">
					<Horizontal gap={4}>
						<InputLabel>{tr["Password"]}</InputLabel>
						<Text c="var(--mantine-color-error)">*</Text>
					</Horizontal>
					<Anchor size="sm" mt={-2}>
						{tr["Forgot password?"]}
					</Anchor>
				</Horizontal>
				<PasswordInput
					value={password}
					onChange={evStringFn(actions.auth.updatePassword)}
					error={authError}
					disabled={isAuthLoading}
				/>
				<Button onClick={actions.auth.loginFn(email, password)} loading={isAuthLoading}>
					{tr["Sign in"]}
				</Button>
				<Divider my={6} />
				<Horizontal gap={4}>
					<Text size="sm" c="var(--mantine-color-dimmed)">
						{tr["No account yet?"]}
					</Text>
					<Anchor>{tr["Create account"]}</Anchor>
				</Horizontal>
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
}: LoginModalProps & { isAuthenticated: boolean }) => (
	<Horizontal justifyContent="space-between">
		<SegmentedControl
			data={["Public", { value: "You", label: "You", disabled: !isAuthenticated }]}
			value={appStore.use().imageView}
			onChange={actions.imageView.update}
		/>
		<Title>Pikilikee</Title>
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
			/>
		)}
	</Horizontal>
);
