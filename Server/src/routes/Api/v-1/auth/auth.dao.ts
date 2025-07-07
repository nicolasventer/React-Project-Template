import { db, schema } from "@/drizzle";
import { and, eq } from "drizzle-orm";

export class AuthDao {
	getUser = (email: string, hashedPassword: string) =>
		db
			.select()
			.from(schema.user)
			.where(and(eq(schema.user.email, email), eq(schema.user.password, hashedPassword)))
			.limit(1)
			.execute()
			.then((res) => res[0]);
}
