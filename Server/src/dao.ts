import { AuthDao } from "@/routes/api/v-1/auth/auth.dao";
import { ImageDao } from "@/routes/api/v-1/image/image.dao";
import { PasswordDao } from "@/routes/api/v-1/password/password.dao";
import { UserDao } from "@/routes/api/v-1/user/user.dao";
import { VoteDao } from "@/routes/api/v-1/vote/vote.dao";

export const dao = {
	user: new UserDao(),
	auth: new AuthDao(),
	password: new PasswordDao(),
	vote: new VoteDao(),
	image: new ImageDao(),
};
