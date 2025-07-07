import { AuthDao } from "@/routes/api/v-1/auth/auth.dao";
import { UserDao } from "@/routes/api/v-1/user/user.dao";

export const dao = {
	user: new UserDao(),
	auth: new AuthDao(),
};
