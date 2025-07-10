import { dao } from "@/dao";
import { JwtService } from "@/jwt";
import type { Headers, MultiImageOutput, MultiImageUserOutput, UnauthorizedValueType } from "@/Shared/SharedModel";
import type { Context } from "elysia";

export class ImageImpl {
	public getAll = (_: Context<{ response: { 200: MultiImageOutput } }>) => dao.image.getAll();

	public getAllSelf = (
		req: Context<{ headers: Headers; response: { 200: MultiImageUserOutput; 401: UnauthorizedValueType } }>
	) => {
		const token = JwtService.getVerifiedLoginToken(req);
		if (token === true) return req.status("Unauthorized", "Token expired");
		if (token === false) return req.status("Unauthorized", "Invalid token");
		return dao.image.getAllSelf(token.id);
	};
}
