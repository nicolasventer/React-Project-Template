import { ApiImpl } from "@/routes/api/api.impl";
import { AuthImpl } from "@/routes/api/v-1/auth/auth.impl";
import { ImageImpl } from "@/routes/api/v-1/image/image.impl";
import { PasswordImpl } from "@/routes/api/v-1/password/password.impl";
import { UserImpl } from "@/routes/api/v-1/user/user.impl";
import { VoteImpl } from "@/routes/api/v-1/vote/vote.impl";

export const impl = {
	user: new UserImpl(),
	api: new ApiImpl(),
	auth: new AuthImpl(),
	password: new PasswordImpl(),
	vote: new VoteImpl(),
	image: new ImageImpl(),
};
