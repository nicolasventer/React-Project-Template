import { relations } from "drizzle-orm/relations";
import { image, user, vote } from "./schema";

export const voteRelations = relations(vote, ({ one }) => ({
	image: one(image, {
		fields: [vote.imageId],
		references: [image.imageId],
	}),
	user: one(user, {
		fields: [vote.userId],
		references: [user.userId],
	}),
}));

export const imageRelations = relations(image, ({ many }) => ({
	votes: many(vote),
}));

export const userRelations = relations(user, ({ many }) => ({
	votes: many(vote),
}));
