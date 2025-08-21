import { auth } from "@/actions/impl/auth";
import { colorScheme } from "@/actions/impl/colorsScheme";
import { images } from "@/actions/impl/images";
import { lang } from "@/actions/impl/lang";
import { localStorageIo } from "@/actions/impl/localStorageIo";
import { profile } from "@/actions/impl/profile";
import { resetPassword } from "@/actions/impl/resetPassword";
import { shell } from "@/actions/impl/shell";
import { url } from "@/actions/impl/url";
import { users } from "@/actions/impl/users";
import { vote } from "@/actions/impl/vote";
import { wakeLock } from "@/actions/impl/wakeLock";

export const actions = {
	auth: auth,
	colorScheme: colorScheme,
	images: images,
	lang: lang,
	localStorageIo: localStorageIo,
	profile: profile,
	resetPassword: resetPassword,
	shell: shell,
	url: url,
	users: users,
	vote: vote,
	wakeLock: wakeLock,
};
