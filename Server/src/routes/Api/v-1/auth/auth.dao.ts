import { db, schema } from "@/drizzle";
import { and, eq } from "drizzle-orm";

export class AuthDao {
	login = (email: string, hashedPassword: string) =>
		db
			.update(schema.user)
			.set({ lastLoginTime: Date.now() })
			.where(and(eq(schema.user.email, email), eq(schema.user.password, hashedPassword)))
			.returning({ userId: schema.user.userId, email: schema.user.email, role: schema.user.role })
			.execute()
			.then((res) => res[0]);
}
