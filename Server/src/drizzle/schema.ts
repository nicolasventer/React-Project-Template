import { ROLES } from "@/Shared/SharedModel";
import { integer, sqliteTable, text, uniqueIndex } from "drizzle-orm/sqlite-core";

export const image = sqliteTable(
	"image",
	{
		imageId: integer().primaryKey({ autoIncrement: true }).notNull(),
		url: text().notNull(),
	},
	(table) => [uniqueIndex("image_url_unique").on(table.url)]
);

export const user = sqliteTable(
	"user",
	{
		userId: integer().primaryKey({ autoIncrement: true }).notNull(),
		email: text().notNull(),
		password: text().notNull(),
		role: text({ enum: ROLES }).notNull(),
		lastLoginTime: integer().notNull(),
	},
	(table) => [uniqueIndex("user_email_unique").on(table.email)]
);

export const vote = sqliteTable(
	"vote",
	{
		voteId: integer().primaryKey({ autoIncrement: true }).notNull(),
		userId: integer()
			.notNull()
			.references(() => user.userId, { onDelete: "cascade", onUpdate: "cascade" }),
		imageId: integer()
			.notNull()
			.references(() => image.imageId, { onDelete: "cascade", onUpdate: "cascade" }),
		isPositive: integer().notNull(),
	},
	(table) => [uniqueIndex("vote_user_image_unique").on(table.userId, table.imageId)]
);
