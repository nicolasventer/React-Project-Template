import { dao } from "@/dao";
import { JwtService, type TokenRequest } from "@/jwt";
import { status } from "elysia";

export class ImageImpl {
	public getAll = (req: TokenRequest) => {
		if (req.headers?.["x-token"]) {
			const verified = JwtService.getVerifiedLoginToken(req);
			if (verified === true) return status("Unauthorized", "Token expired");
			if (verified === false) return status("Unauthorized", "Invalid token");
			const userId = verified.userId;
			return dao.image.getAll(userId);
		}
		return dao.image.getAll();
	};
}
