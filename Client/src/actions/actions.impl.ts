import { auth } from "@/actions/impl/auth";
import { colorScheme } from "@/actions/impl/colorsScheme";
import { errorMessage } from "@/actions/impl/errorMessage";
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
	auth,
	colorScheme,
	errorMessage,
	images,
	lang,
	localStorageIo,
	profile,
	resetPassword,
	shell,
	url,
	users,
	vote,
	wakeLock,
};
