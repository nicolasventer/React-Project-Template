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
};

export default _tr;

/** @ignore */
export type Tr = typeof _tr;
