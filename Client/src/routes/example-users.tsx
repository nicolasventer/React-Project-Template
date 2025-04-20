import { actions } from "@/actions/actions.impl";
import type { AppState } from "@/globalState";
import { mainContentStore, useApp } from "@/globalState";
import { PERMISSIONS, type ExampleUser } from "@/Shared/SharedModel";
import { evStringFn } from "@/utils/clientUtils";
import { Box, Horizontal, Vertical } from "@/utils/ComponentToolbox";
import { Button, MultiSelect, Table, TextInput, Title } from "@mantine/core";
import { useEffect, useMemo, useRef } from "react";

const filterUsers = ({ users, filter }: { users: AppState["users"]["all"]; filter: string }) =>
	users.filter((user) => {
		if (user.edit) return true;
		const { name, email, permissions } = user.current;
		return (
			name.toLowerCase().includes(filter.toLowerCase()) ||
			email.toLowerCase().includes(filter.toLowerCase()) ||
			permissions.some((permission) => permission.toLowerCase().includes(filter.toLowerCase()))
		);
	});

const Row = ({ userCurrent, index }: { userCurrent: ExampleUser; index: number }) => (
	<Table.Tr key={index}>
		<Table.Td>{userCurrent.name}</Table.Td>
		<Table.Td>{userCurrent.email}</Table.Td>
		<Table.Td>{userCurrent.permissions.join(", ")}</Table.Td>
		<Table.Td>
			<Horizontal gap={6}>
				<Button onClick={actions.users.edit.startFn(index)}>Edit</Button>
				<Button color="red" onClick={actions.users.deleteFn(index)}>
					Delete
				</Button>
			</Horizontal>
		</Table.Td>
	</Table.Tr>
);

const EditRow = ({ userEdit, index }: { userEdit: ExampleUser; index: number }) => (
	<Table.Tr key={index}>
		<Table.Td>
			<TextInput value={userEdit.name} onChange={evStringFn(actions.users.edit.name.updateFn(index))} />
		</Table.Td>
		<Table.Td>
			<TextInput value={userEdit.email} onChange={evStringFn(actions.users.edit.email.updateFn(index))} />
		</Table.Td>
		<Table.Td>
			<MultiSelect data={PERMISSIONS} value={userEdit.permissions} onChange={actions.users.edit.permissions.updateFn(index)} />
		</Table.Td>
		<Table.Td>
			<Horizontal gap={6}>
				<Button onClick={actions.users.edit.saveFn(index)}>Save</Button>
				<Button color="red" onClick={actions.users.edit.cancelFn(index)}>
					Cancel
				</Button>
			</Horizontal>
		</Table.Td>
	</Table.Tr>
);

const FilterZone = ({ filter }: { filter: string }) => (
	<Horizontal gap={6} widthFull>
		<Box flexGrow>
			<TextInput placeholder="Filter" value={filter} onChange={evStringFn(actions.users.filter.update)} />
		</Box>
		<Button onClick={actions.users.add}>Add User</Button>
	</Horizontal>
);

const Body = ({ filteredUsers, isLoading }: { filteredUsers: AppState["users"]["all"]; isLoading: boolean }) => (
	<Table.Tbody>
		{isLoading ? (
			<Table.Tr>
				<Table.Td colSpan={4}>Loading...</Table.Td>
			</Table.Tr>
		) : (
			filteredUsers.map((user, index) =>
				user.edit ? (
					// eslint-disable-next-line react/no-array-index-key
					<EditRow key={index} userEdit={user.edit} index={index} />
				) : (
					// eslint-disable-next-line react/no-array-index-key
					<Row key={index} userCurrent={user.current} index={index} />
				)
			)
		)}
	</Table.Tbody>
);

const useLoadUsersOnMount = () =>
	useEffect(
		() =>
			void actions.users.all
				.update(import("@/assets/data/Users.json").then((res) => res.default as ExampleUser[]))
				.catch(() => {}),
		[]
	);

export const ExampleUsers = () => {
	const app = useApp();

	const users = app.users.all;
	const filter = app.users.filter;
	const filteredUsers = useMemo(() => filterUsers({ users, filter }), [users, filter]);

	const mainContentRef = useRef<HTMLDivElement>(null);
	mainContentStore.useEffect((setMainContent) => setMainContent(mainContentRef.current), [mainContentRef.current]);

	useLoadUsersOnMount();

	return (
		<Vertical gap={6} ref={mainContentRef}>
			<Title order={3}>Example Users</Title>
			<FilterZone filter={filter} />
			<Table>
				<Table.Thead>
					<Table.Tr>
						<Table.Th>Name</Table.Th>
						<Table.Th>Email</Table.Th>
						<Table.Th>Permission</Table.Th>
						<Table.Th>Actions</Table.Th>
					</Table.Tr>
				</Table.Thead>
				<Body filteredUsers={filteredUsers} isLoading={app.users.isLoading} />
			</Table>
		</Vertical>
	);
};
