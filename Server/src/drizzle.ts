import * as relations from "@/drizzle/relations";
import * as schema from "@/drizzle/schema";
import { DATABASE_URL } from "@/env";
// eslint-disable-next-line project-structure/independent-modules
import { hashPassword } from "@/utils/hash";
import type { Column } from "drizzle-orm";
import { sql } from "drizzle-orm";
import { drizzle } from "drizzle-orm/bun-sqlite";

export { relations, schema };

export const db = drizzle(DATABASE_URL, { schema: { ...schema, ...relations } });

export const json_group_array = <T>(column: Column) => sql<T[]>`json_group_array(${column})`;

export type User = typeof schema.user.$inferSelect;

const seed = async () => {
	const CLEAN_UP = true;

	const IMAGES_COUNT = 500;
	const USERS_COUNT = 50;
	const VOTES_COUNT_PER_USER = 100;

	if (CLEAN_UP) {
		console.log("cleaning up...");
		await db.delete(schema.image).execute();
		await db.delete(schema.user).execute();
		await db.delete(schema.vote).execute();
	}

	console.log(`seeding ${IMAGES_COUNT} images...`);
	const images: { url: string }[] = await Promise.all(
		Array.from({ length: IMAGES_COUNT }, async (_, i) => fetch(`https://picsum.photos/128/128?${i}`).then((res) => res.url))
	).then((res) => Array.from(new Set(res)).map((url) => ({ url })));
	await db.insert(schema.image).values(images);

	console.log(`seeding first user...`);
	await db
		.insert(schema.user)
		.values({
			email: "admin",
			password: await hashPassword("admin"),
			role: "admin" as const,
			lastLoginTime: Date.now(),
		})
		.execute();

	console.log(`seeding ${USERS_COUNT} users...`);
	const users = await Promise.all(
		Array.from({ length: USERS_COUNT }, async (_, userIndex) => ({
			email: `user${userIndex + 1}`,
			password: await hashPassword(`user${userIndex + 1}`),
			role: "user" as const,
			lastLoginTime: Date.now(),
		}))
	);
	await db.insert(schema.user).values(users).execute();

	console.log(`seeding ${USERS_COUNT * VOTES_COUNT_PER_USER} votes...`);
	const votes = Array.from({ length: USERS_COUNT }, (_, userIndex) =>
		Array.from(new Set(Array.from({ length: VOTES_COUNT_PER_USER }, () => Math.floor(Math.random() * images.length)))).map(
			(imageIndex) => ({
				userId: userIndex + 1,
				imageId: imageIndex + 1,
				isPositive: Math.random() > 0.5 ? 1 : 0,
			})
		)
	).flat();
	await db.insert(schema.vote).values(votes).execute();

	console.log("seeded completed");
};

if (require.main === module) seed();
