import { dao } from "@/dao";
import type { LoginPayload } from "@/jwt";
import type { CreateVote, IdNum, UpdateVote } from "@/Shared/SharedModel";
import { status } from "elysia";

export class VoteImpl {
	create = (req: LoginPayload, createVote: CreateVote) => dao.vote.create(req.userId, createVote);

	update = (req: LoginPayload, { id }: IdNum, updateVote: UpdateVote) =>
		dao.vote
			.update(req.userId, id, updateVote)
			.then((updated) => (updated ? "Vote updated" : status("Not Found", "Vote not found")));

	delete = (req: LoginPayload, { id }: IdNum) =>
		dao.vote.delete(req.userId, id).then((deleted) => (deleted ? "Vote deleted" : status("Not Found", "Vote not found")));
}
