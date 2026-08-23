import type { CreateUser, IdNum, UpdateSelfUser, UpdateUser } from "@/Shared/SharedModel";
import { dao } from "@/dao";
import type { AppContext, LoginPayload } from "@/jwt";
import { JwtService } from "@/jwt";
import { mailService } from "@/mail";
import { B_ENABLE_MAIL_SERVICE } from "@/srv_config";
import { hashPassword } from "@/utils/hash";
import { status } from "elysia";

export class UserImpl {
	public create = async (_: AppContext, { email, password }: CreateUser) => {
		const hashedPassword = await hashPassword(password);
		const user = await dao.user.create(email, hashedPassword);
		if (B_ENABLE_MAIL_SERVICE) mailService.sendEmail(email, "Welcome to our app", "Welcome to our app").catch(() => {});
		return user;
	};

	public getAll = (_: AppContext) => dao.user.getAll();

	public update = (_: AppContext, idNum: IdNum, updateUser: UpdateUser) =>
		dao.user.update(idNum, updateUser).then((res) => {
			JwtService.revokeLoginId(idNum.id);
			return res;
		});

	public updateSelf = (req: LoginPayload, updateUser: UpdateSelfUser) =>
		dao.user
			.update({ id: req.userId }, updateUser)
			.then((updated) => (updated ? "User updated" : status("Not Found", "User not found")))
			.then((res) => {
				JwtService.revokeLoginId(req.userId);
				return res;
			});

	public delete = (_: AppContext, idNum: IdNum) =>
		dao.user.delete(idNum).then((res) => {
			JwtService.revokeLoginId(idNum.id);
			return res;
		});

	public deleteSelf = (req: LoginPayload) =>
		dao.user
			.delete({ id: req.userId })
			.then((deleted) => (deleted ? "User deleted" : status("Not Found", "User not found")))
			.then((res) => {
				JwtService.revokeLoginId(req.userId);
				return res;
			});
}
