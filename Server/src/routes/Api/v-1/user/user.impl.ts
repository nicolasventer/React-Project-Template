import type { CreateUser, IdNum, UpdateSelfUser, UpdateUser } from "@/Shared/SharedModel";
import { dao } from "@/dao";
import { JwtService } from "@/jwt";
import type { Context } from "elysia";

export class UserImpl {
	// TODO:  send email to user
	public create = (_: Context, createUser: CreateUser) => dao.user.create(createUser);

	public getAll = (req: Context) => JwtService.checkRole(req, "admin") || dao.user.getAll();

	// TODO: ensure that the user cannot update their own role
	public update = (req: Context<{ params: IdNum }>, idNum: IdNum, updateUser: UpdateUser) =>
		JwtService.checkRole(req, "admin") || dao.user.update(idNum, updateUser);

	public updateSelf = (req: Context, updateUser: UpdateSelfUser) => {
		const verified = JwtService.getVerifiedLoginToken(req);
		if (verified === true) return req.status("Unauthorized", "Token expired");
		if (verified === false) return req.status("Unauthorized", "Invalid token");
		const idNum = { id: verified.id };
		return dao.user
			.update(idNum, updateUser)
			.then((updated) => (updated ? req.status("OK", "User updated") : req.status("Not Found", "User not found")));
	};

	// TODO: ensure that the user cannot delete himself
	public delete = (req: Context<{ params: IdNum }>, idNum: IdNum) => JwtService.checkRole(req, "admin") || dao.user.delete(idNum);

	public deleteSelf = (req: Context) => {
		const verified = JwtService.getVerifiedLoginToken(req);
		if (verified === true) return req.status("Unauthorized", "Token expired");
		if (verified === false) return req.status("Unauthorized", "Invalid token");
		const idNum = { id: verified.id };
		return dao.user
			.delete(idNum)
			.then((deleted) => (deleted ? req.status("OK", "User deleted") : req.status("Not Found", "User not found")));
	};
}
