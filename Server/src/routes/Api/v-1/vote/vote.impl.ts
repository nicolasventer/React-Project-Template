import { dao } from "@/dao";
import { JwtService } from "@/jwt";
import type { CreateVote, IdNum, UnauthorizedValueType, UpdateVote, VoteOutput } from "@/Shared/SharedModel";
import type { Context } from "elysia";

export class VoteImpl {
	create = (req: Context<{ response: { 200: VoteOutput; 401: UnauthorizedValueType } }>, createVote: CreateVote) => {
		const token = JwtService.getVerifiedLoginToken(req);
		if (token === true) return req.status("Unauthorized", "Token expired");
		if (token === false) return req.status("Unauthorized", "Invalid token");
		return dao.vote.create(token.userId, createVote);
	};

	update = (
		req: Context<{ params: IdNum; response: { 200: "Vote updated"; 401: UnauthorizedValueType; 404: "Vote not found" } }>,
		{ id }: IdNum,
		updateVote: UpdateVote
	) => {
		const token = JwtService.getVerifiedLoginToken(req);
		if (token === true) return req.status("Unauthorized", "Token expired");
		if (token === false) return req.status("Unauthorized", "Invalid token");
		return dao.vote
			.update(token.userId, id, updateVote)
			.then((updated) => (updated ? "Vote updated" : req.status("Not Found", "Vote not found")));
	};

	delete = (
		req: Context<{ params: IdNum; response: { 200: "Vote deleted"; 401: UnauthorizedValueType; 404: "Vote not found" } }>,
		{ id }: IdNum
	) => {
		const token = JwtService.getVerifiedLoginToken(req);
		if (token === true) return req.status("Unauthorized", "Token expired");
		if (token === false) return req.status("Unauthorized", "Invalid token");
		return dao.vote
			.delete(token.userId, id)
			.then((deleted) => (deleted ? "Vote deleted" : req.status("Not Found", "Vote not found")));
	};
}
