import type { ExampleUser, FindUser } from "@/Shared/SharedModel";
import { db, json_group_array, schema } from "@/drizzle";
import { eq } from "drizzle-orm";
import type { Context } from "elysia";

export class UserImpl {
	private users: ExampleUser[] = [
		{ name: "Tracey Mccormick", email: "wcunningham@mitchell.com", permissions: ["update"] },
		{ name: "Amy Thompson", email: "lneal@allen.com", permissions: ["read"] },
		{ name: "Donna Richards", email: "hjackson@gmail.com", permissions: ["admin", "read"] },
		{ name: "Krista Huffman", email: "fernandokane@hotmail.com", permissions: ["update"] },
		{ name: "Melanie Roberts", email: "lsullivan@yahoo.com", permissions: ["create"] },
	];

	public async get(req: Context, getUserParams: { email: string }) {
		const usersSql = db
			.select({ email: schema.user.email, role: schema.user.role, permissions: json_group_array(schema.permission.name) })
			.from(schema.user)
			.innerJoin(schema.permission, eq(schema.user.role, schema.permission.role))
			.groupBy(schema.user.email);
		console.log(`usersSql.toSQL().sql: ${usersSql.toSQL().sql}`);
		const users = await usersSql.execute();
		console.log(users);
		const foundUsers = this.find(req, getUserParams);
		if (foundUsers.length === 0) return req.status("Not Found", "User not found");
		return foundUsers[0];
	}

	public find(_: Context, findUserParams?: FindUser | null) {
		if (!findUserParams) return this.users;
		const { name, email, permissions } = findUserParams;
		return this.users.filter((user) => {
			if (name && user.name !== name) return false;
			if (email && user.email !== email) return false;
			if (permissions && !permissions.every((permission) => user.permissions.includes(permission))) return false;
			return true;
		});
	}

	public async create(req: Context, user: ExampleUser) {
		const foundUsers = this.find(req, { email: user.email });
		if (foundUsers.length > 0) return req.status("Conflict", "User already exists");
		this.users.push(user);
		return user;
	}

	public update(req: Context, findUserParams: FindUser, user: ExampleUser) {
		const foundUsers = this.find(req, findUserParams);
		if (foundUsers.length === 0) return req.status("Not Found", "User not found");
		const foundUser = foundUsers[0];
		const index = this.users.indexOf(foundUser);
		this.users[index] = user;
		return user;
	}

	public delete(req: Context, deleteUserParams: { email: string }) {
		const foundUsers = this.find(req, deleteUserParams);
		if (foundUsers.length === 0) return req.status("Not Found", "User not found");
		const foundUser = foundUsers[0];
		const index = this.users.indexOf(foundUser);
		this.users.splice(index, 1);
		return "User deleted";
	}
}
