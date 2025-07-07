import type { CreateUser, IdNum, UpdateUser, UserOutput } from "@/Shared/SharedModel";
import { db, schema } from "@/drizzle";
import { randomUUIDv7 } from "bun";
import { eq } from "drizzle-orm";

export class UserDao {
	public getAll = (): Promise<UserOutput[]> =>
		db
			.select({
				id: schema.user.id,
				email: schema.user.email,
				role: schema.user.role,
				lastLoginTime: schema.user.lastLoginTime,
			})
			.from(schema.user)
			.execute();

	public create = (user: CreateUser): Promise<UserOutput> =>
		db
			.insert(schema.user)
			.values({ ...user, lastLoginTime: Date.now(), password: randomUUIDv7() })
			.returning({
				id: schema.user.id,
				email: schema.user.email,
				role: schema.user.role,
				lastLoginTime: schema.user.lastLoginTime,
			})
			.execute()
			.then((res) => res[0]);

	public update = ({ id }: IdNum, updateUser: UpdateUser) =>
		db.update(schema.user).set(updateUser).where(eq(schema.user.id, id)).execute();

	public delete = ({ id }: IdNum) => db.delete(schema.user).where(eq(schema.user.id, id)).execute();
}
