import { relations } from "drizzle-orm/relations";
import { permission, role, user } from "./schema";

export const permissionRelations = relations(permission, ({ one }) => ({
	role: one(role, {
		fields: [permission.role],
		references: [role.value],
	}),
}));

export const roleRelations = relations(role, ({ many }) => ({
	permissions: many(permission),
	users: many(user),
}));

export const userRelations = relations(user, ({ one }) => ({
	role: one(role, {
		fields: [user.role],
		references: [role.value],
	}),
}));
