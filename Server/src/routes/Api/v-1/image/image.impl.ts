import { dao } from "@/dao";
import { JwtService } from "@/jwt";
import type { Headers, MultiImageOutput, UnauthorizedValueType } from "@/Shared/SharedModel";
import type { Context } from "elysia";

export class ImageImpl {
	public getAll = (req: Context<{ headers?: Headers; response: { 200: MultiImageOutput; 401: UnauthorizedValueType } }>) => {
		if (req.headers?.["x-token"]) {
			const verified = JwtService.getVerifiedLoginToken(req);
			if (verified === true) return req.status("Unauthorized", "Token expired");
			if (verified === false) return req.status("Unauthorized", "Invalid token");
			const userId = verified.userId;
			return dao.image.getAll(userId);
		}
		return dao.image.getAll();
	};
}
