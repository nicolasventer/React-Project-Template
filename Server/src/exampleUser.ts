import type { Context } from "elysia";
import type { ExampleUser, FindUser } from "./Shared/SharedModel";

const users: ExampleUser[] = [
	{ name: "Tracey Mccormick", email: "wcunningham@mitchell.com", permissions: ["update"] },
	{ name: "Amy Thompson", email: "lneal@allen.com", permissions: ["read"] },
	{ name: "Donna Richards", email: "hjackson@gmail.com", permissions: ["admin", "read"] },
	{ name: "Krista Huffman", email: "fernandokane@hotmail.com", permissions: ["update"] },
	{ name: "Melanie Roberts", email: "lsullivan@yahoo.com", permissions: ["create"] },
];

type GetUser = { email: string };

export const getUser = (req: Context, getUserParams: GetUser) => {
	const foundUsers = findUsers(req, getUserParams);
	if (foundUsers.length === 0) return req.error("Not Found", "User not found");
	return foundUsers[0];
};

export const findUsers = (_: Context, findUserParams?: FindUser | null) => {
	if (!findUserParams) return users;
	const { name, email, permissions } = findUserParams;
	return users.filter((user) => {
		if (name && user.name !== name) return false;
		if (email && user.email !== email) return false;
		if (permissions && !permissions.every((permission) => user.permissions.includes(permission))) return false;
		return true;
	});
};

// TODO: add check of permission
export const createUser = (req: Context, user: ExampleUser) => {
	const foundUsers = findUsers(req, { email: user.email });
	if (foundUsers.length > 0) return req.error("Conflict", "User already exists");
	users.push(user);
	return user;
};

export const updateUser = (req: Context, findUserParams: FindUser, user: ExampleUser) => {
	const foundUsers = findUsers(req, findUserParams);
	if (foundUsers.length === 0) return req.error("Not Found", "User not found");
	const foundUser = foundUsers[0];
	const index = users.indexOf(foundUser);
	users[index] = user;
	return user;
};

type DeleteUser = { email: string };

export const deleteUser = (req: Context, deleteUserParams: DeleteUser) => {
	const foundUsers = findUsers(req, deleteUserParams);
	if (foundUsers.length === 0) return req.error("Not Found", "User not found");
	const foundUser = foundUsers[0];
	const index = users.indexOf(foundUser);
	users.splice(index, 1);
	return "User deleted";
};
