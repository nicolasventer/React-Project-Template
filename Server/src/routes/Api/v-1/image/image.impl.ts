import { dao } from "@/dao";
import { JwtService } from "@/jwt";
import type { Headers, MultiImageOutput, UnauthorizedValueType } from "@/Shared/SharedModel";
import type { Context } from "elysia";

export class ImageImpl {
	public getAll = (req: Context<{ headers?: Headers; response: { 200: MultiImageOutput; 401: UnauthorizedValueType } }>) => {
		const token = JwtService.getVerifiedLoginToken(req);
		const userId = typeof token === "boolean" ? undefined : token.id;
		return dao.image.getAll(userId);
	};
}
