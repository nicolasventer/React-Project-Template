import { dao } from "@/dao";
import { JwtService } from "@/jwt";
import type { Context } from "elysia";

export class ImageImpl {
	public getAll = (_: Context) => dao.image.getAll();

	public getAllSelf = (req: Context) => {
		const token = JwtService.getVerifiedLoginToken(req);
		if (token === true) return req.status("Unauthorized", "Token expired");
		if (token === false) return req.status("Unauthorized", "Invalid token");
		return dao.image.getAllSelf(token.id);
	};
}
