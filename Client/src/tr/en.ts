import { LANGUAGES_OBJ, type LanguageType } from "../Common/CommonModel";

/** @ignore */
const _tr = {
	lang: LANGUAGES_OBJ.en as LanguageType,
	Loading: "Loading",
	Error: "Error",
	"not found": "not found",
	"is not implemented yet": "is not implemented yet",
	// Home
	Home: "Home",
	// NotFound
	"404 Not Found": "404 Not Found",
	"Redirecting to the home page...": "Redirecting to the home page...",
};

export default _tr;

/** @ignore */
export type Tr = typeof _tr;
