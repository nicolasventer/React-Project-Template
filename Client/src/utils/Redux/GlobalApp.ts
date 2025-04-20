/* eslint-disable react-hooks/rules-of-hooks */
import type { DiffObj } from "@/utils/Redux/ISerializable";
import { cleverMerge, cloneWithUpdate, partialMerge } from "@/utils/Redux/ISerializable";
import type { DevTools } from "@/utils/Redux/ReduxType";
import type { NotFunction, Store } from "@/utils/Store";
import { store } from "@/utils/Store";
import type { Config } from "@redux-devtools/extension";
import { useEffect, useMemo, useRef, type Dispatch, type SetStateAction } from "react";

/** The type of a function that is not an array */
export type NotArray<T> = T extends unknown[] ? never : T;

/**
 * Convert a function name and parameters to a string
 * @param functionName - The name of the function
 * @param fnParams - The parameters of the function
 * @returns The string of the function name and parameters
 */
export const fnStr = (functionName: string, ...fnParams: NotArray<unknown>[]) => `${functionName}(${fnParams.join(", ")})`;

/** The type of a function that is called when the global app is updated */
export type OnUpdateGlobalApp = (props: {
	/** The name of the function that is called */
	functionName: string;
	/** The parameters of the function that is called */
	functionParams: NotArray<unknown>[];
	/** The computed name of the function that is called */
	computedName: string;
}) => void;

/** The class of the global app */
export class GlobalApp<T extends NotFunction<unknown>> {
	/** The store of the global app */
	public appStore: Store<T>;
	private updateName = "";
	private onUpdate?: OnUpdateGlobalApp;
	private isSetAppEnabledStore = store(true).private;

	/**
	 * @param app - The initial state of the global app.
	 * @param debugLabel - The label to use for debugging.
	 */
	constructor(app: T, debugLabel?: string) {
		this.appStore = store(app, debugLabel);
	}

	private setAppValue: Dispatch<SetStateAction<T>> = () => {};

	private setApp_(functionName: string, value: SetStateAction<T>): void;
	private setApp_(functionName: string, functionParams: NotArray<unknown>[], value: SetStateAction<T>): void;
	private setApp_(
		functionName: string,
		...params: [SetStateAction<T>] | [functionParams: NotArray<unknown>[], value: SetStateAction<T>]
	) {
		const [functionParams, value] = params.length === 2 ? params : [[], params[0]];
		this.updateName = fnStr(functionName, functionParams);
		this.setAppValue(value);
		this.onUpdate?.({ functionName, functionParams, computedName: this.updateName });
	}
	/**
	 * Set the value of the global app.
	 * @param functionName - The name of the function to call.
	 * @param functionParams - The parameters of the function to call.
	 * @param value - The value to set.
	 */
	setApp = this.setApp_.bind(this);

	private setPartialApp_(functionName: string, value: DiffObj<T>): void;
	private setPartialApp_(functionName: string, functionParams: NotArray<unknown>[], value: DiffObj<T>): void;
	private setPartialApp_(
		functionName: string,
		...params: [DiffObj<T>] | [functionParams: NotArray<unknown>[], value: DiffObj<T>]
	) {
		const [functionParams, value] = params.length === 2 ? params : [[], params[0]];
		this.updateName = fnStr(functionName, functionParams);
		this.setAppValue((prev) => partialMerge(prev, value));
		this.onUpdate?.({ functionName, functionParams, computedName: this.updateName });
	}
	/**
	 * Partially update the value of the global app.
	 * @param functionName - The name of the function to call.
	 * @param functionParams - The parameters of the function to call.
	 * @param value - The value that will be merged with the current global app state.
	 */
	setPartialApp = this.setPartialApp_.bind(this);

	private setAppWithUpdate_(functionName: string, update: (prev: T) => void): void;
	private setAppWithUpdate_(functionName: string, functionParams: NotArray<unknown>[], update: (prev: T) => void): void;
	private setAppWithUpdate_(
		functionName: string,
		...params: [update: (prev: T) => void] | [functionParams: NotArray<unknown>[], update: (prev: T) => void]
	) {
		const [functionParams, update] = params.length === 2 ? params : [[], params[0]];
		this.updateName = fnStr(functionName, functionParams);
		this.setAppValue((prev) => cloneWithUpdate(prev as T & object, update));
		this.onUpdate?.({ functionName, functionParams, computedName: this.updateName });
	}
	/**
	 * Set the value of the global app with an update function.
	 * @param functionName - The name of the function to call.
	 * @param functionParams - The parameters of the function to call.
	 * @param update - The update function.
	 */
	setAppWithUpdate = this.setAppWithUpdate_.bind(this);

	/**
	 * Initialize the global app for the use of the Redux DevTools. Set the devToolsConfig to null to disable the devTools.
	 * @param globalOptions - The global options (devToolsConfig, onUpdate, autoEnableSetApp).
	 * @returns The global app.
	 */
	useInit = (
		globalOptions: { devtoolsConfig?: Config | null; onUpdate?: OnUpdateGlobalApp; autoEnableSetApp?: boolean } = {}
	) => {
		const { devtoolsConfig = { trace: true, traceLimit: 6 }, onUpdate, autoEnableSetApp = true } = globalOptions;

		const [app, setApp_] = this.appStore.private.useState();
		const [isAppEnabled, setIsAppEnabled] = this.isSetAppEnabledStore.useState();
		const lastActionId = useRef(0);

		const devTools = useMemo(
			() => devtoolsConfig && (window.__REDUX_DEVTOOLS_EXTENSION__?.connect(devtoolsConfig) as DevTools),
			// eslint-disable-next-line react-hooks/exhaustive-deps
			[]
		);

		useEffect(() => {
			const setApp: typeof setApp_ = (value) => {
				if (!isAppEnabled) return;
				// use of value instead of app since the value is passed by reference
				// @ts-expect-error cannot handle the case where T is a function
				if (typeof value === "function") return setApp(value(this.appStore.private.value));
				devTools?.send({ type: this.updateName }, { value });
				lastActionId.current++;
				const result = setApp_(value);
				this.setAppValue = setApp;
				return result;
			};
			this.setAppValue = setApp;
			// eslint-disable-next-line react-hooks/exhaustive-deps
		}, [isAppEnabled]);

		useEffect(() => {
			this.onUpdate = onUpdate;
			devTools?.init({ value: app });
			return devTools?.subscribe((message) => {
				if (message.type === "DISPATCH" && message.state) {
					if (message.payload.actionId !== lastActionId.current) setIsAppEnabled(false);
					else if (autoEnableSetApp) setIsAppEnabled(true);
					const parsedMessage = JSON.parse(message.state);
					if (parsedMessage.value) setApp_((prev) => cleverMerge(prev, parsedMessage.value));
				}
			});
			// eslint-disable-next-line react-hooks/exhaustive-deps
		}, []);

		return app;
	};

	/**
	 * Hook to get and set the setAppEnabled store.
	 * @returns The value and the function to set it.
	 */
	useSetAppEnabled = () => this.isSetAppEnabledStore.useState();
}
