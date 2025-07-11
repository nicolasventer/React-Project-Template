import type { IdNum, MultiUserOutput, RoleType, UpdateSelfUser, UpdateUser, UserOutput } from "@/Shared/SharedModel";
import { db, schema } from "@/drizzle";
import { SQLiteError } from "bun:sqlite";
import { eq } from "drizzle-orm";

export class UserDao {
	public getAll = (): Promise<MultiUserOutput> =>
		db
			.select({
				userId: schema.user.userId,
				email: schema.user.email,
				role: schema.user.role,
				lastLoginTime: schema.user.lastLoginTime,
			})
			.from(schema.user)
			.execute()
			.then((res) => ({ users: res }));

	public create = async (email: string, password: string): Promise<UserOutput> => {
		const adminCount = await db
			.select()
			.from(schema.user)
			.where(eq(schema.user.role, "admin"))
			.limit(1)
			.execute()
			.then((res) => res.length);
		// Set role to "admin" if no admin users exist, otherwise "user"
		const role: RoleType = adminCount === 0 ? "admin" : "user";

		return db
			.insert(schema.user)
			.values({ email, password, lastLoginTime: Date.now(), role })
			.returning({
				userId: schema.user.userId,
				email: schema.user.email,
				role: schema.user.role,
				lastLoginTime: schema.user.lastLoginTime,
			})
			.execute()
			.then((res) => res[0])
			.catch((err) => {
				if (err instanceof SQLiteError && err.code === "SQLITE_CONSTRAINT_UNIQUE")
					throw new Error("A user with this email already exists");
				throw err;
			});
	};

	public update = ({ id }: IdNum, updateUser: UpdateUser | UpdateSelfUser) =>
		db
			.update(schema.user)
			.set(updateUser)
			.where(eq(schema.user.userId, id))
			.returning({ userId: schema.user.userId })
			.execute()
			.then((res) => res[0]);

	public delete = ({ id }: IdNum) =>
		db
			.delete(schema.user)
			.where(eq(schema.user.userId, id))
			.returning({ userId: schema.user.userId })
			.execute()
			.then((res) => res[0]);
}
