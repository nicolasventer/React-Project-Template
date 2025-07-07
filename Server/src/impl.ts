import { ApiImpl } from "@/routes/api/api.impl";
import { AuthImpl } from "@/routes/api/v-1/auth/auth.impl";
import { UserImpl } from "@/routes/api/v-1/user/user.impl";

export const impl = {
	user: new UserImpl(),
	api: new ApiImpl(),
	auth: new AuthImpl(),
};
