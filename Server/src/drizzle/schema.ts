import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core";

export const permission = sqliteTable("permission", {
	id: integer().primaryKey({ autoIncrement: true }).notNull(),
	name: text(),
	role: text().references(() => role.value, { onDelete: "cascade", onUpdate: "cascade" }),
});

export const role = sqliteTable("role", {
	value: text().primaryKey().notNull(),
});

export const user = sqliteTable("user", {
	email: text().primaryKey().notNull(),
	password: text(),
	role: text().references(() => role.value, { onDelete: "cascade", onUpdate: "cascade" }),
});
