import { dao } from "@/dao";
import type { LoginPayload } from "@/jwt";
import type { CreateVote, IdNum, UnauthorizedValueType, UpdateVote, VoteOutput } from "@/Shared/SharedModel";
import type { Context } from "elysia";

export class VoteImpl {
	create = (req: Context<{ response: { 200: VoteOutput; 401: UnauthorizedValueType } }> & LoginPayload, createVote: CreateVote) =>
		dao.vote.create(req.userId, createVote);

	update = (
		req: Context<{ params: IdNum; response: { 200: "Vote updated"; 401: UnauthorizedValueType; 404: "Vote not found" } }> &
			LoginPayload,
		{ id }: IdNum,
		updateVote: UpdateVote
	) =>
		dao.vote
			.update(req.userId, id, updateVote)
			.then((updated) => (updated ? "Vote updated" : req.status("Not Found", "Vote not found")));

	delete = (
		req: Context<{ params: IdNum; response: { 200: "Vote deleted"; 401: UnauthorizedValueType; 404: "Vote not found" } }> &
			LoginPayload,
		{ id }: IdNum
	) => dao.vote.delete(req.userId, id).then((deleted) => (deleted ? "Vote deleted" : req.status("Not Found", "Vote not found")));
}
