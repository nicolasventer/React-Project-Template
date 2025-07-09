import type { CreateUser, IdNum, UpdateSelfUser, UpdateUser } from "@/Shared/SharedModel";
import { dao } from "@/dao";
import { JwtService } from "@/jwt";
import { mailService } from "@/mail";
import { B_ENABLE_MAIL_SERVICE } from "@/srv_config";
import type { Context } from "elysia";

export class UserImpl {
	public create = (_: Context, createUser: CreateUser) => {
		const user = dao.user.create(createUser);
		if (B_ENABLE_MAIL_SERVICE)
			mailService.sendEmail(createUser.email, "Welcome to our app", "Welcome to our app").catch(() => {});
		return user;
	};

	public getAll = (req: Context) => JwtService.checkRole(req, "admin") || dao.user.getAll();

	public update = (req: Context<{ params: IdNum }>, idNum: IdNum, updateUser: UpdateUser) =>
		JwtService.checkRole(req, "admin") ||
		dao.user.update(idNum, updateUser).then((res) => {
			JwtService.revokeLoginId(idNum.id);
			return res;
		});

	public updateSelf = (req: Context, updateUser: UpdateSelfUser) => {
		const verified = JwtService.getVerifiedLoginToken(req);
		if (verified === true) return req.status("Unauthorized", "Token expired");
		if (verified === false) return req.status("Unauthorized", "Invalid token");
		const idNum = { id: verified.id };
		return dao.user
			.update(idNum, updateUser)
			.then((updated) => (updated ? "User updated" : req.status("Not Found", "User not found")))
			.then((res) => {
				JwtService.revokeLoginId(idNum.id);
				return res;
			});
	};

	public delete = (req: Context<{ params: IdNum }>, idNum: IdNum) =>
		JwtService.checkRole(req, "admin") ||
		dao.user.delete(idNum).then((res) => {
			JwtService.revokeLoginId(idNum.id);
			return res;
		});

	public deleteSelf = (req: Context) => {
		const verified = JwtService.getVerifiedLoginToken(req);
		if (verified === true) return req.status("Unauthorized", "Token expired");
		if (verified === false) return req.status("Unauthorized", "Invalid token");
		const idNum = { id: verified.id };
		return dao.user
			.delete(idNum)
			.then((deleted) => (deleted ? "User deleted" : req.status("Not Found", "User not found")))
			.then((res) => {
				JwtService.revokeLoginId(idNum.id);
				return res;
			});
	};
}
