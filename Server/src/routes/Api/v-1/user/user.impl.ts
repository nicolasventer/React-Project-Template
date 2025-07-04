import type {
	CreateUser,
	IdNum,
	MultiUserOutput,
	UnauthorizedValueType,
	UpdateSelfUser,
	UpdateUser,
	UpdateUserOutput,
	UserOutput,
} from "@/Shared/SharedModel";
import { dao } from "@/dao";
import type { LoginPayload } from "@/jwt";
import { JwtService } from "@/jwt";
import { mailService } from "@/mail";
import { B_ENABLE_MAIL_SERVICE } from "@/srv_config";
import { hashPassword } from "@/utils/hash";
import type { Context } from "elysia";

export class UserImpl {
	public create = async (_: Context<{ response: { 200: UserOutput } }>, { email, password }: CreateUser) => {
		const hashedPassword = await hashPassword(password);
		const user = await dao.user.create(email, hashedPassword);
		if (B_ENABLE_MAIL_SERVICE) mailService.sendEmail(email, "Welcome to our app", "Welcome to our app").catch(() => {});
		return user;
	};

	public getAll = (_: Context<{ response: { 200: MultiUserOutput } }>) => dao.user.getAll();

	public update = (_: Context<{ params: IdNum; response: { 200: UpdateUserOutput } }>, idNum: IdNum, updateUser: UpdateUser) =>
		dao.user.update(idNum, updateUser).then((res) => {
			JwtService.revokeLoginId(idNum.id);
			return res;
		});

	public updateSelf = (
		req: Context<{ response: { 200: "User updated"; 401: UnauthorizedValueType; 404: "User not found" } }> & LoginPayload,
		updateUser: UpdateSelfUser
	) =>
		dao.user
			.update({ id: req.userId }, updateUser)
			.then((updated) => (updated ? "User updated" : req.status("Not Found", "User not found")))
			.then((res) => {
				JwtService.revokeLoginId(req.userId);
				return res;
			});

	public delete = (_: Context<{ params: IdNum; response: { 200: UpdateUserOutput } }>, idNum: IdNum) =>
		dao.user.delete(idNum).then((res) => {
			JwtService.revokeLoginId(idNum.id);
			return res;
		});

	public deleteSelf = (
		req: Context<{ response: { 200: "User deleted"; 401: UnauthorizedValueType; 404: "User not found" } }> & LoginPayload
	) =>
		dao.user
			.delete({ id: req.userId })
			.then((deleted) => (deleted ? "User deleted" : req.status("Not Found", "User not found")))
			.then((res) => {
				JwtService.revokeLoginId(req.userId);
				return res;
			});
}
