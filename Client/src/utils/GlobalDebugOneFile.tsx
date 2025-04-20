/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react-hooks/rules-of-hooks */
import type { DependencyList, Dispatch, ReactNode, SetStateAction } from "react";
import { useCallback, useDebugValue, useEffect, useMemo, useState } from "react";

type NotFunction<T> = T extends (...args: unknown[]) => unknown ? never : T;

/**
 * Global state class.
 * @template T - The type of the global state.
 */
class Store<T extends NotFunction<unknown>> {
	private onChange: Dispatch<SetStateAction<T>>[];

	/**
	 * Constructor for the global state.
	 * @param val - The initial value of the global state.
	 * @param debugLabel - The label to use for debugging.
	 */
	constructor(private val: T, private debugLabel?: string) {
		// @ts-expect-error cannot handle the case where T is a function
		this.onChange = [(v) => void (this.val = typeof v === "function" ? v(this.val) : v)];
	}

	/** Returns the current value of the global state. */
	public use = () => this.useState()[0];

	/** Returns the current value of the global state and a function to set it. */
	public useState = () => {
		const [s, setS] = useState(this.val);
		useDebugValue(this.debugLabel);
		useEffect(() => {
			this.onChange.push(setS);
			return () => void (this.onChange = this.onChange.filter((v) => v !== setS));
		}, []);
		const newSetS: Dispatch<SetStateAction<T>> = useCallback((newVal) => this.onChange.forEach((v) => v(newVal)), []);
		return [s, newSetS] as const;
	};

	/**
	 * Calls `React.useEffect` where the effect function has access to the set function of the store.
	 * @param effect - The effect function.
	 * @param deps - The dependencies of the effect.
	 */
	public useEffect = (effect: (setVal: Dispatch<SetStateAction<T>>) => void, deps: DependencyList) => {
		const newSetS: Dispatch<SetStateAction<T>> = useCallback((newVal) => this.onChange.forEach((v) => v(newVal)), []);
		// eslint-disable-next-line react-hooks/exhaustive-deps
		useEffect(() => effect(newSetS), deps);
	};
}

type DebugType =
	| "boolean"
	| "number"
	| "string"
	| "text"
	| "color"
	| "select"
	| "button"
	| [DebugType]
	| { [key: string]: DebugType };

type DebugTypeToValue<T extends DebugType> = T extends "boolean"
	? boolean
	: T extends "number"
	? number
	: T extends "string" | "text" | "color" | "select"
	? string
	: T extends "button"
	? (...parmas: any) => void
	: T extends [DebugType]
	? DebugTypeToValue<T[0]>[]
	: T extends { [key: string]: DebugType }
	? { [K in keyof T]: DebugTypeToValue<T[K]> }
	: never;

type DebugTypeToExtra<T extends DebugType> = T extends "number"
	? { min?: number; max?: number; step?: number; readonly?: boolean }
	: T extends "select"
	? { options: readonly string[]; readonly?: boolean }
	: T extends "text"
	? { handleTab?: boolean; readonly?: boolean }
	: T extends [DebugType]
	? { [key: number]: DebugTypeToExtra<T[0]> } & { open?: boolean; all?: DebugTypeToExtra<T[0]>; resizable?: boolean }
	: T extends { [key: string]: DebugType }
	? { [K in keyof T]?: DebugTypeToExtra<T[K]> } & { open?: boolean }
	: { readonly?: boolean };

type DebugTypeToItem<T extends DebugType> = {
	name: string;
	type: T;
	value: DebugTypeToValue<T>;
	extra: DebugTypeToExtra<T>;
};

type DebugTypeToItemWithSetValue<T extends DebugType> = DebugTypeToItem<T> & {
	setValue: (newValue: DebugTypeToValue<T>) => void;
	children: ReactNode;
};

const defaultExtra = <T extends DebugType>(type: T): DebugTypeToExtra<T> =>
	(typeof type === "object"
		? Array.isArray(type)
			? [defaultExtra(type[0])]
			: Object.fromEntries(Object.entries(type).map(([key, value]) => [key, defaultExtra(value)]))
		: type === "number"
		? { min: 0, max: 100 }
		: type === "select"
		? { options: [] }
		: {}) as DebugTypeToExtra<T>;

const defaultValue = <T extends DebugType>(type: T, extra: DebugTypeToExtra<T>): DebugTypeToValue<T> =>
	(typeof type === "object"
		? Array.isArray(type)
			? [defaultValue(type[0], (extra as DebugTypeToExtra<[DebugType]>)?.[0])]
			: Object.fromEntries(Object.entries(type).map(([key, value]) => [key, defaultValue(value, (extra as any)?.[key])]))
		: type === "number"
		? 0
		: type === "color"
		? "#ffffff"
		: type === "boolean"
		? false
		: "") as DebugTypeToValue<T>;

const RenderBoolean = (props: DebugTypeToItemWithSetValue<"boolean">) => (
	<div>
		{props.name}:
		<div>
			<input
				type="checkbox"
				checked={props.value}
				onChange={(e) => props.setValue(e.target.checked)}
				disabled={props.extra.readonly}
			/>
			{props.children}
		</div>
	</div>
);

const RenderNumber = (props: DebugTypeToItemWithSetValue<"number">) => (
	<div>
		{props.name}:
		<div style={{ display: "flex" }}>
			<input
				type="range"
				min={props.extra.min}
				max={props.extra.max}
				step={props.extra.step ?? ((props.extra.max ?? 100) - (props.extra.min ?? 0)) / 100}
				value={props.value}
				onChange={(e) => props.setValue(parseFloat(e.target.value))}
				style={{ width: 70 }}
				disabled={props.extra.readonly}
			/>
			<input
				type="number"
				value={props.value}
				step={props.extra.step ?? ((props.extra.max ?? 100) - (props.extra.min ?? 0)) / 100}
				onChange={(e) => props.setValue(parseFloat(e.target.value))}
				style={{ width: "4em" }}
				disabled={props.extra.readonly}
			/>
			{props.children}
		</div>
	</div>
);

const RenderSelect = (props: DebugTypeToItemWithSetValue<"select">) => (
	<div>
		{props.name}:
		<div>
			<select value={props.value} onChange={(e) => props.setValue(e.target.value)} aria-readonly={props.extra.readonly}>
				{props.extra.options.map((option) => (
					<option key={option} value={option}>
						{option}
					</option>
				))}
			</select>
			{props.children}
		</div>
	</div>
);

const RenderString = (props: DebugTypeToItemWithSetValue<"string">) => (
	<div>
		{props.name}:
		<div>
			<input
				type="text"
				value={props.value}
				onChange={(e) => props.setValue(e.target.value)}
				style={{ width: 100 }}
				disabled={props.extra.readonly}
			/>
			{props.children}
		</div>
	</div>
);

const RenderText = (props: DebugTypeToItemWithSetValue<"text">) => (
	<div>
		{props.name}:
		<div>
			<textarea
				value={props.value}
				onChange={(e) => props.setValue(e.target.value)}
				style={{ width: 100 }}
				disabled={props.extra.readonly}
				onKeyDown={(e) => {
					if (!props.extra.handleTab) return;
					if (e.key !== "Tab") return;
					e.preventDefault();
					const start = e.currentTarget.selectionStart;
					const end = e.currentTarget.selectionEnd;
					if (e.shiftKey) {
						// check if there is a tab before the cursor
						if (e.currentTarget.value.substring(start - 1, start) !== "\t") return;
						e.currentTarget.value = e.currentTarget.value.substring(0, start - 1) + e.currentTarget.value.substring(end);
						e.currentTarget.selectionStart = e.currentTarget.selectionEnd = start - 1;

						props.setValue(e.currentTarget.value);
						return;
					}
					e.currentTarget.value = e.currentTarget.value.substring(0, start) + "\t" + e.currentTarget.value.substring(end);
					e.currentTarget.selectionStart = e.currentTarget.selectionEnd = start + 1;

					props.setValue(e.currentTarget.value);
				}}
			/>
			{props.children}
		</div>
	</div>
);

const RenderColor = (props: DebugTypeToItemWithSetValue<"color">) => (
	<div>
		{props.name}:
		<div style={{ display: "flex", alignItems: "center", paddingLeft: 5 }}>
			<input type="color" value={props.value} onChange={(e) => props.setValue(e.target.value)} disabled={props.extra.readonly} />
			<input
				type="text"
				value={props.value}
				onChange={(e) => props.setValue(e.target.value)}
				style={{ marginLeft: 5, width: "5em" }}
				disabled={props.extra.readonly}
			/>
			{props.children}
		</div>
	</div>
);

const RenderButton = (props: DebugTypeToItemWithSetValue<"button">) => (
	<div>
		<button onClick={props.value} disabled={props.extra.readonly}>
			{props.name}
		</button>
		{props.children}
	</div>
);

const RenderArray = (props: DebugTypeToItemWithSetValue<[DebugType]>) => (
	<details open={props.extra.open} className="debug-parent">
		<summary>{props.name}</summary>
		<div style={{ paddingLeft: 16 }}>
			{Array.isArray(props.value)
				? props.value.map((v, index) => (
						<RenderItem
							// eslint-disable-next-line react/no-array-index-key
							key={index}
							item={{
								name: `${props.name}[${index}]`,
								type: props.type[0] as DebugType,
								value: v,
								extra: props.extra?.[index] ?? props.extra?.["all"] ?? {},
								setValue: (newValue) => props.setValue(props.value.map((v, i) => (i === index ? newValue : v))),
								children: props.extra.resizable && (
									<button
										onClick={() => props.setValue([...props.value.slice(0, index), ...props.value.slice(index + 1)])}
										style={{ margin: "auto", marginLeft: 3 }}
									>
										X
									</button>
								),
							}}
						/>
				  ))
				: null}
			{props.extra.resizable && (
				<button
					onClick={() =>
						props.setValue([...props.value, defaultValue(props.type[0], props.extra ?? defaultExtra(props.type[0]))])
					}
				>
					Add
				</button>
			)}
		</div>
	</details>
);

const RenderObject = (props: DebugTypeToItemWithSetValue<{ [key: string]: DebugType }>) => (
	<div className="debug-parent">
		<details open={props.extra.open} className="debug-parent" style={{ flexGrow: 1 }}>
			<summary>{props.name}</summary>
			<div style={{ paddingLeft: 16 }}>
				{Object.entries(props.type).map(([key, value]) => (
					<RenderItem
						key={key}
						item={{
							name: key,
							type: value,
							value: props.value[key],
							extra: props.extra[key] ?? {},
							setValue: (newValue) => {
								if (typeof props.value === "object") props.setValue({ ...props.value, [key]: newValue });
							},
							children: null,
						}}
					/>
				))}
			</div>
		</details>
		{props.children}
	</div>
);

const RenderItem = ({ item }: { item: DebugTypeToItemWithSetValue<DebugType> }) => (
	<>
		{item.type === "boolean" && <RenderBoolean {...(item as DebugTypeToItemWithSetValue<"boolean">)} />}
		{item.type === "number" && <RenderNumber {...(item as DebugTypeToItemWithSetValue<"number">)} />}
		{item.type === "select" && <RenderSelect {...(item as DebugTypeToItemWithSetValue<"select">)} />}
		{item.type === "string" && <RenderString {...(item as DebugTypeToItemWithSetValue<"string">)} />}
		{item.type === "text" && <RenderText {...(item as DebugTypeToItemWithSetValue<"text">)} />}
		{item.type === "color" && <RenderColor {...(item as DebugTypeToItemWithSetValue<"color">)} />}
		{item.type === "button" && <RenderButton {...(item as DebugTypeToItemWithSetValue<"button">)} />}
		{Array.isArray(item.type) && <RenderArray {...(item as DebugTypeToItemWithSetValue<[DebugType]>)} />}
		{!Array.isArray(item.type) && typeof item.type === "object" && (
			<RenderObject {...(item as DebugTypeToItemWithSetValue<{ [key: string]: DebugType }>)} />
		)}
	</>
);

const RenderAll = (props: { debugValueArray: DebugTypeToItemWithSetValue<DebugType>[] }) => (
	<div style={{ padding: 10, paddingTop: 3 }} className="debug-parent">
		{props.debugValueArray.map((item) => (
			<div key={item.name}>
				<RenderItem item={item} />
			</div>
		))}
	</div>
);

const styleEl = document.createElement("style");
styleEl.innerHTML = `.debug-parent > div > div { display: flex; justify-content: space-between; margin: 2px 0; }`;
document.head.appendChild(styleEl);

export type State<T> = [T, (newState: T) => void];

const colorToHex = (str: string) => {
	const ctx = document.createElement("canvas").getContext("2d")!;
	ctx.fillStyle = str;
	return ctx.fillStyle;
};

const recurColorToHex = <T extends DebugType>(type: T, value: DebugTypeToValue<T>): DebugTypeToValue<T> => {
	if (type === "color") return colorToHex(value as string) as DebugTypeToValue<T>;
	if (typeof type === "object") {
		if (Array.isArray(type)) {
			const valueAsArray = value as any[];
			for (let i = 0; i < valueAsArray.length; i++) valueAsArray[i] = recurColorToHex(type[0], valueAsArray[i]);
			return valueAsArray as DebugTypeToValue<T>;
		} else {
			const valueAsObject = value as any;
			for (const key in type) valueAsObject[key] = recurColorToHex(type[key] as DebugType, valueAsObject[key]);
			return valueAsObject as DebugTypeToValue<T>;
		}
	}
	return value;
};

const deepEqual = (a: unknown, b: unknown): boolean => {
	if (a === b) return true;
	if (typeof a !== typeof b) return false;
	if (typeof a === "function" && typeof b === "function") return a.toString() === b.toString();
	if (typeof a !== "object" || typeof b !== "object" || a === null || b === null) return false;
	if (Array.isArray(a)) {
		if (!Array.isArray(b)) return false;
		return a.length === b.length && a.every((v, i) => deepEqual(v, b[i]));
	}
	return Object.keys(a).every((k) => deepEqual(a[k as keyof typeof a], b[k as keyof typeof b]));
};

class LocalDebugger {
	private _debugValueArray: (DebugTypeToItem<DebugType> & { defaultValue: DebugTypeToValue<DebugType> })[] = [];
	private refreshStore = new Store({});

	public useDebugWithSet = <T extends DebugType>(
		type: T,
		name: string,
		stateValue: DebugTypeToValue<T> | State<DebugTypeToValue<T>>,
		extra?: DebugTypeToExtra<T>
	) => {
		const [refresh, setRefresh] = this.refreshStore.useState();
		const [defaultValue_, onChange] =
			Array.isArray(stateValue) && typeof stateValue[1] === "function" && stateValue[1].length !== 0
				? (stateValue as State<DebugTypeToValue<T>>)
				: [stateValue, undefined];
		const defaultValue = recurColorToHex(type, defaultValue_ as DebugTypeToValue<T>);

		const value = this._debugValueArray.find((item) => item.name === name)?.value ?? defaultValue;
		const setValue = (newValue: DebugTypeToValue<T>) => {
			const item = this._debugValueArray.find((item) => item.name === name);
			if (item) {
				if (!deepEqual(type, item.type))
					throw new Error(
						`variable ${name} already exists with type ${JSON.stringify(item.type)}, cannot use type ${JSON.stringify(type)}`
					);
				(item.value as DebugTypeToValue<T>) = recurColorToHex(type, newValue);
				setRefresh({});
			}
		};

		useEffect(() => {
			const item = this._debugValueArray.find((item) => item.name === name);
			if (deepEqual(defaultValue, item?.defaultValue)) return;
			if (!deepEqual(value, defaultValue)) setValue(defaultValue);
			// eslint-disable-next-line react-hooks/exhaustive-deps
		}, [defaultValue]);

		useEffect(() => {
			if (this._debugValueArray.find((item) => item.name === name)) return;
			this._debugValueArray.push({ name, type, defaultValue, value: defaultValue, extra: extra ?? defaultExtra(type) });
			setRefresh({});
			// eslint-disable-next-line react-hooks/exhaustive-deps
		}, [this._debugValueArray]);

		useEffect(() => {
			if (!onChange) return;
			const item = this._debugValueArray.find((item) => item.name === name);
			if (item) onChange(item.value as DebugTypeToValue<T>);
			// eslint-disable-next-line react-hooks/exhaustive-deps
		}, [refresh]);

		useEffect(
			() => () => {
				this._debugValueArray.splice(
					this._debugValueArray.findIndex((item) => item.name === name),
					1
				);
				setRefresh({});
			},
			// eslint-disable-next-line react-hooks/exhaustive-deps
			[]
		);

		return [value, setValue] as State<DebugTypeToValue<T>>;
	};

	public useDebug = <T extends DebugType>(
		type: T,
		name: string,
		stateValue: DebugTypeToValue<T> | State<DebugTypeToValue<T>>,
		extra?: DebugTypeToExtra<T>
	) => this.useDebugWithSet(type, name, stateValue, extra)[0];

	public Render = () => {
		const [refresh, setRefresh] = this.refreshStore.useState();

		const setValue =
			<T extends DebugType>(item: DebugTypeToItem<T>) =>
			(newValue: DebugTypeToValue<T>) => {
				item.value = newValue;
				setRefresh({});
			};

		const debugValueArray = useMemo(
			() => this._debugValueArray.map((item) => ({ ...item, setValue: setValue(item), children: null })),
			// eslint-disable-next-line react-hooks/exhaustive-deps
			[refresh]
		);

		// eslint-disable-next-line react-hooks/exhaustive-deps
		useEffect(() => setRefresh({}), []);

		return <RenderAll debugValueArray={debugValueArray} />;
	};
}

const GlobalDebug = new LocalDebugger();

// eslint-disable-next-line react-refresh/only-export-components
export const useDebug = GlobalDebug.useDebug;

export const RenderDebug = (props: {
	position?: "top-left" | "top-right" | "bottom-left" | "bottom-right";
	expand?: boolean;
}) => {
	const position = useDebug("select", "position", props.position ?? "bottom-left", {
		options: ["top-left", "top-right", "bottom-left", "bottom-right"],
	});

	const top = position.includes("top") ? 0 : undefined;
	const bottom = position.includes("bottom") ? 0 : undefined;
	const left = position.includes("left") ? 0 : undefined;
	const right = position.includes("right") ? 0 : undefined;

	const [expand, setExpand] = useState(props.expand ?? false);

	return (
		<div
			style={{
				position: "fixed",
				top,
				bottom,
				left,
				right,
				border: "solid",
				zIndex: 9999,
				color: "black",
				backgroundColor: "white",
				minWidth: 250,
				minHeight: expand ? 200 : undefined,
				maxHeight: "100%",
				overflow: "auto",
			}}
		>
			<div style={{ position: "relative" }}>
				<h3 style={{ margin: "3px auto 0px auto", textAlign: "center", width: "fit-content" }}>Debug</h3>
				<div style={{ position: "absolute", top: 0, left: 0, width: "100%", height: "100%" }}>
					<button style={{ position: "absolute", right: 10 }} onClick={() => setExpand(!expand)}>
						{expand ? "-" : "+"}
					</button>
				</div>
			</div>
			<div style={{ borderBottom: "1px solid" }}></div>
			{expand && <GlobalDebug.Render />}
		</div>
	);
};
