import type { MultiImageOutput } from "@/Shared/SharedModel";
import { db, schema } from "@/drizzle";
import { eq, sql } from "drizzle-orm";

export class ImageDao {
	private addScore = <T extends { positiveVotes: number; negativeVotes: number }>(img: T) => ({
		...img,
		totalVotes: img.positiveVotes + img.negativeVotes,
		score: img.positiveVotes - img.negativeVotes,
	});

	public getAll = (userId?: number): Promise<MultiImageOutput> =>
		db
			.select({
				imageId: schema.image.imageId,
				url: schema.image.url,
				positiveVotes: sql<number>`COUNT(CASE WHEN vote.isPositive = 1 THEN 1 END)`,
				negativeVotes: sql<number>`COUNT(CASE WHEN vote.isPositive = 0 THEN 1 END)`,
				userVote: sql<number>`CASE WHEN vote.userId = ${userId ?? -1} THEN vote.isPositive END`,
				userVoteId: sql<number>`CASE WHEN vote.userId = ${userId ?? -1} THEN vote.voteId END`,
			})
			.from(schema.image)
			.leftJoin(schema.vote, eq(schema.image.imageId, schema.vote.imageId))
			.groupBy(schema.image.imageId)
			.execute()
			.then((res) => ({ images: res.map(this.addScore) }));
}
