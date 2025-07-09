import { auth } from "@/actions/impl/auth";
import { colorScheme } from "@/actions/impl/colorsScheme";
import { errorMessage } from "@/actions/impl/errorMessage";
import { images } from "@/actions/impl/images";
import { lang } from "@/actions/impl/lang";
import { localStorageIo } from "@/actions/impl/localStorageIo";
import { shell } from "@/actions/impl/shell";
import { url } from "@/actions/impl/url";
import { wakeLock } from "@/actions/impl/wakeLock";

export const actions = {
	auth,
	colorScheme,
	errorMessage,
	images,
	lang,
	localStorageIo,
	shell,
	url,
	wakeLock,
};
