import { actions } from "@/actions/actions.impl";
import { useApp, useTr } from "@/globalState";
import type { Tr } from "@/tr/en";
import { evStringFn } from "@/utils/clientUtils";
import { HashedString } from "@/utils/Redux/HashedString";
import { Anchor, Button, Container, Group, Paper, PasswordInput, Text, TextInput, Title } from "@mantine/core";
import classes from "./AuthenticationTitle.module.css";

const LoginPageContent = ({ email, password, authError, tr }: { email: string; password: string; authError: string; tr: Tr }) => (
	<Container size={420} my={40}>
		<Title ta="center" className={classes.title}>
			Welcome back!
		</Title>

		<Text className={classes.subtitle}>
			{tr["Do not have an account yet?"]} <Anchor>{tr["Create account"]}</Anchor>
		</Text>

		<Paper withBorder shadow="sm" p={22} mt={30} radius="md">
			<TextInput
				label="Email"
				required
				radius="md"
				value={email}
				onChange={evStringFn(actions.auth.updateEmail)}
				error={!!authError}
			/>
			<PasswordInput
				label="Password"
				placeholder="Your password"
				required
				mt="md"
				radius="md"
				value={password}
				onChange={evStringFn((pwd) => actions.auth.updatePassword(new HashedString(pwd)))}
				error={authError}
			/>
			<Group justify="space-between" mt="lg">
				<div />
				<Anchor component="button" size="sm">
					{tr["Forgot password?"]}
				</Anchor>
			</Group>
			<Button fullWidth mt="xl" radius="md" onClick={() => actions.auth.login(email, new HashedString(password))}>
				{tr["Sign In"]}
			</Button>
		</Paper>
	</Container>
);

export const LoginPage = () => {
	const app = useApp();
	const tr = useTr();
	return (
		<LoginPageContent email={app.auth.user.email} password={app.auth.user.password.get()} authError={app.auth.error} tr={tr} />
	);
};
