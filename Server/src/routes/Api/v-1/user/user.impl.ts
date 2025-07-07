import type { CreateUser, IdNum, UpdateUser } from "@/Shared/SharedModel";
import { dao } from "@/dao";
import { JwtService } from "@/jwt";
import type { Context } from "elysia";

export class UserImpl {
	public create = (req: Context, createUser: CreateUser) => JwtService.checkRole(req, "admin") || dao.user.create(createUser);

	public getAll = (req: Context) => JwtService.checkRole(req, "admin") || dao.user.getAll();

	public update = (req: Context<{ params: IdNum }>, idNum: IdNum, updateUser: UpdateUser) =>
		JwtService.checkRole(req, "admin") || dao.user.update(idNum, updateUser);

	public updateSelf = (req: Context, updateUser: UpdateUser) => {
		const verified = JwtService.getVerifiedLoginToken(req);
		if (verified === true) return req.status("Unauthorized", "Token expired");
		if (verified === false) return req.status("Unauthorized", "Invalid token");
		const idNum = { id: verified.id };
		return dao.user.update(idNum, updateUser);
	};

	public delete = (req: Context<{ params: IdNum }>, idNum: IdNum) => JwtService.checkRole(req, "admin") || dao.user.delete(idNum);

	public deleteSelf = (req: Context) => {
		const verified = JwtService.getVerifiedLoginToken(req);
		if (verified === true) return req.status("Unauthorized", "Token expired");
		if (verified === false) return req.status("Unauthorized", "Invalid token");
		const idNum = { id: verified.id };
		return dao.user.delete(idNum);
	};
}
