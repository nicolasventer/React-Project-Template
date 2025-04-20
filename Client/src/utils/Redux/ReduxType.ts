/* eslint-disable @typescript-eslint/no-explicit-any */
import "@redux-devtools/extension";

const _source = "@devtools-extension";

interface StartAction {
	readonly type: "START";
	readonly state: undefined;
	readonly id: undefined;
	readonly _source: typeof _source;
}

interface StopAction {
	readonly type: "STOP";
	readonly state: undefined;
	readonly id: undefined;
	readonly _source: typeof _source;
	readonly failed?: boolean;
}

interface DispatchAction {
	readonly type: "DISPATCH";
	readonly payload: { type: "JUMP_TO_ACTION"; actionId: number }; //AppDispatchAction;
	readonly state: string | undefined;
	readonly id: string;
	readonly _source: typeof _source;
}

interface ImportAction {
	readonly type: "IMPORT";
	readonly payload: undefined;
	readonly state: string | undefined;
	readonly id: string;
	readonly _source: typeof _source;
}

interface ActionAction {
	readonly type: "ACTION";
	readonly payload: string | any; //| CustomAction;
	readonly state: string | undefined;
	readonly id: string;
	readonly _source: typeof _source;
}

interface ExportAction {
	readonly type: "EXPORT";
	readonly payload: undefined;
	readonly state: string | undefined;
	readonly id: string;
	readonly _source: typeof _source;
}

interface UpdateAction {
	readonly type: "UPDATE";
	readonly state: string | undefined;
	readonly id: string;
	readonly _source: typeof _source;
}

type FilterStateValue = "DO_NOT_FILTER" | "DENYLIST_SPECIFIC" | "ALLOWLIST_SPECIFIC";

interface Options {
	readonly useEditor: number;
	readonly editor: string;
	readonly projectPath: string;
	readonly maxAge: number;
	readonly filter: FilterStateValue;
	readonly allowlist: string;
	readonly denylist: string;
	readonly shouldCatchErrors: boolean;
	readonly inject: boolean;
	readonly urls: string;
	readonly showContextMenus: boolean;
}

interface OptionsAction {
	readonly type: "OPTIONS";
	readonly options: Options;
	readonly id: undefined;
	readonly _source: typeof _source;
}

export type ContentScriptToPageScriptMessage =
	| StartAction
	| StopAction
	| DispatchAction
	| ImportAction
	| ActionAction
	| ExportAction
	| UpdateAction
	| OptionsAction;

export type DevTools = ReturnType<NonNullable<typeof window.__REDUX_DEVTOOLS_EXTENSION__>["connect"]> & {
	subscribe: (onMessage: (message: ContentScriptToPageScriptMessage) => void) => void;
};
