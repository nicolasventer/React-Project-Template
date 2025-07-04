import { db, schema } from "@/drizzle";
import type { ResetPasswordPayload } from "@/jwt";
import type { UpdatePassword } from "@/Shared/SharedModel";
import { and, eq } from "drizzle-orm";

export class PasswordDao {
	getUserByEmail = (email: string) =>
		db
			.select({ email: schema.user.email, password: schema.user.password })
			.from(schema.user)
			.where(eq(schema.user.email, email))
			.limit(1)
			.execute()
			.then((res) => res[0]);

	updatePassword = ({ email, password: oldPassword }: ResetPasswordPayload, { password }: UpdatePassword) =>
		db
			.update(schema.user)
			.set({ password })
			.where(and(eq(schema.user.email, email), eq(schema.user.password, oldPassword)))
			.returning()
			.execute()
			.then((res) => res[0]);
}
