import type { CreateUser, IdNum, MultiUserOutput, UpdateSelfUser, UpdateUser, UserOutput } from "@/Shared/SharedModel";
import { db, schema } from "@/drizzle";
import { eq } from "drizzle-orm";

export class UserDao {
	public getAll = (): Promise<MultiUserOutput> =>
		db
			.select({
				id: schema.user.id,
				email: schema.user.email,
				role: schema.user.role,
				lastLoginTime: schema.user.lastLoginTime,
			})
			.from(schema.user)
			.execute()
			.then((res) => ({ users: res }));

	public create = (user: CreateUser): Promise<UserOutput> =>
		db
			.insert(schema.user)
			.values({ ...user, lastLoginTime: Date.now(), role: "user" })
			.returning({
				id: schema.user.id,
				email: schema.user.email,
				role: schema.user.role,
				lastLoginTime: schema.user.lastLoginTime,
			})
			.execute()
			.then((res) => res[0]);

	public update = ({ id }: IdNum, updateUser: UpdateUser | UpdateSelfUser) =>
		db
			.update(schema.user)
			.set(updateUser)
			.where(eq(schema.user.id, id))
			.returning({ id: schema.user.id })
			.execute()
			.then((res) => res[0]);

	public delete = ({ id }: IdNum) =>
		db
			.delete(schema.user)
			.where(eq(schema.user.id, id))
			.returning({ id: schema.user.id })
			.execute()
			.then((res) => res[0]);
}
