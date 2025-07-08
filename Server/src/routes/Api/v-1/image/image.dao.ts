import type { MultiImageOutput } from "@/Shared/SharedModel";
import { db, schema } from "@/drizzle";
import { eq, sql } from "drizzle-orm";

export class ImageDao {
	public getAll = (): Promise<MultiImageOutput> =>
		db
			.select({
				imageId: schema.image.imageId,
				url: schema.image.url,
				positiveVotes: sql<number>`COUNT(CASE WHEN vote.isPositive = 1 THEN 1 END)`,
				negativeVotes: sql<number>`COUNT(CASE WHEN vote.isPositive = 0 THEN 1 END)`,
				totalVotes: sql<number>`COUNT(vote.voteId)`,
				score: sql<number>`SUM(CASE WHEN vote.isPositive = 1 THEN 1 ELSE -1 END)`,
			})
			.from(schema.image)
			.leftJoin(schema.vote, eq(schema.image.imageId, schema.vote.imageId))
			.groupBy(schema.image.imageId)
			.execute()
			.then((res) => ({ images: res }));

	public getAllSelf = (userId: number): Promise<MultiImageOutput> =>
		db
			.select({
				imageId: schema.image.imageId,
				url: schema.image.url,
				positiveVotes: sql<number>`COUNT(CASE WHEN vote.isPositive = 1 THEN 1 END)`,
				negativeVotes: sql<number>`COUNT(CASE WHEN vote.isPositive = 0 THEN 1 END)`,
				totalVotes: sql<number>`COUNT(vote.voteId)`,
				score: sql<number>`SUM(CASE WHEN vote.isPositive = 1 THEN 1 ELSE -1 END)`,
				userVote: sql<number>`CASE WHEN vote.userId = ${schema.user.id} THEN vote.isPositive END`,
			})
			.from(schema.image)
			.leftJoin(schema.vote, eq(schema.image.imageId, schema.vote.imageId))
			.leftJoin(schema.user, eq(schema.vote.userId, userId))
			.groupBy(schema.image.imageId)
			.execute()
			.then((res) => ({ images: res }));
}
