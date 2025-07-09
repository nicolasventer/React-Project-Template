import { dao } from "@/dao";
import { JwtService } from "@/jwt";
import type { CreateVote, IdNum, UpdateVote } from "@/Shared/SharedModel";
import type { Context } from "elysia";

export class VoteImpl {
	create = (req: Context, createVote: CreateVote) => {
		const token = JwtService.getVerifiedLoginToken(req);
		if (token === true) return req.status("Unauthorized", "Token expired");
		if (token === false) return req.status("Unauthorized", "Invalid token");
		return dao.vote.create(token.id, createVote);
	};

	update = (req: Context<{ params: IdNum }>, { id }: IdNum, updateVote: UpdateVote) => {
		const token = JwtService.getVerifiedLoginToken(req);
		if (token === true) return req.status("Unauthorized", "Token expired");
		if (token === false) return req.status("Unauthorized", "Invalid token");
		return dao.vote
			.update(token.id, id, updateVote)
			.then((updated) => (updated ? "Vote updated" : req.status("Not Found", "Vote not found")));
	};

	delete = (req: Context<{ params: IdNum }>, { id }: IdNum) => {
		const token = JwtService.getVerifiedLoginToken(req);
		if (token === true) return req.status("Unauthorized", "Token expired");
		if (token === false) return req.status("Unauthorized", "Invalid token");
		return dao.vote
			.delete(token.id, id)
			.then((deleted) => (deleted ? "Vote deleted" : req.status("Not Found", "Vote not found")));
	};
}
