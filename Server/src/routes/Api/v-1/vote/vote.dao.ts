import { db, schema } from "@/drizzle";
import type { CreateVote, UpdateVote, VoteOutput } from "@/Shared/SharedModel";
import { and, eq } from "drizzle-orm";

export class VoteDao {
	create = (userId: number, createVote: CreateVote): Promise<VoteOutput> =>
		db
			.insert(schema.vote)
			.values({ ...createVote, userId, isPositive: createVote.isPositive ? 1 : 0 })
			.returning({ voteId: schema.vote.voteId })
			.execute()
			.then((res) => res[0]);

	update = (userId: number, voteId: number, updateVote: UpdateVote): Promise<VoteOutput> =>
		db
			.update(schema.vote)
			.set({ isPositive: updateVote.isPositive ? 1 : 0 })
			.where(and(eq(schema.vote.voteId, voteId), eq(schema.vote.userId, userId)))
			.returning({ voteId: schema.vote.voteId })
			.execute()
			.then((res) => res[0]);

	delete = (userId: number, voteId: number): Promise<VoteOutput> =>
		db
			.delete(schema.vote)
			.where(and(eq(schema.vote.voteId, voteId), eq(schema.vote.userId, userId)))
			.returning({ voteId: schema.vote.voteId })
			.execute()
			.then((res) => res[0]);
}
