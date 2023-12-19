import { ActionIcon, Button, Indicator, Paper, Text, ThemeIcon, Tooltip } from "@mantine/core";
import { computed, signal } from "@preact/signals";
import { GripHorizontal } from "lucide-react";
import { type MouseEventHandler, type TouchEventHandler, useRef } from "react";
import { GrClear } from "react-icons/gr";
import type { LogType } from "../Common/CommonModel";
import { globalState } from "../context/GlobalState";
import { Horizontal, Overlap, Vertical } from "../utils/ComponentToolbox";
const isWrap = signal(false);

document.addEventListener("keydown", (ev) => {
	if (ev.key === "z" && ev.altKey) isWrap.value = !isWrap.value;
});

const mousePos = signal({ x: 0, y: 0 });
const startConsoleHeight = signal(0);
const isConsoleResizing = signal(false);
const isHandleHovered = signal(false);

const startResize: MouseEventHandler<HTMLElement> & TouchEventHandler<HTMLElement> = (ev) => {
	ev.stopPropagation();
	mousePos.value = "clientX" in ev ? { x: ev.clientX, y: ev.clientY } : { x: ev.touches[0].clientX, y: ev.touches[0].clientY };
	startConsoleHeight.value = globalState.consoleHeight.value;
	isConsoleResizing.value = true;
	document.body.addEventListener("mousemove", resize);
	document.body.addEventListener("mouseup", stopResize);
	document.body.addEventListener("touchmove", resize);
	document.body.addEventListener("touchend", stopResize);
};

const closeHeight = computed(() => globalState.viewportSize.value.height * 0.05);
const openHeight = computed(() => globalState.viewportSize.value.height * 0.15);
const maxConsoleHeight = computed(() => globalState.viewportSize.value.height * 0.5);

const resize = (ev: MouseEvent | TouchEvent) => {
	ev.stopPropagation();
	if (!isConsoleResizing.value) return;
	const clientY = ev instanceof MouseEvent ? ev.clientY : ev.touches[0].clientY;
	const newHeight = startConsoleHeight.value + mousePos.value.y - clientY;
	globalState.consoleHeight.value = Math.max(openHeight.value, Math.min(maxConsoleHeight.value, newHeight));
	if (newHeight <= closeHeight.value) {
		globalState.isConsoleDisplayed.value = false;
		globalState.consoleHeight.value = startConsoleHeight.value;
	} else if (newHeight >= openHeight.value) {
		globalState.isConsoleDisplayed.value = true;
		globalState.logToSeeCount.value = 0;
	}
};
const stopResize = (ev: MouseEvent | TouchEvent) => {
	ev.stopPropagation();
	isConsoleResizing.value = false;
	document.body.removeEventListener("mousemove", resize);
	document.body.removeEventListener("mouseup", stopResize);
	document.body.removeEventListener("touchmove", resize);
	document.body.removeEventListener("touchend", stopResize);
};

/**
 * The console that displays the execution log and errors, it can be resized and hidden.\
 * Be sure to call {@link setConsoleType | setConsoleType("custom")} or {@link setConsoleType | setConsoleType("both")} to use this console.\
 * Put the component in a parent with `relative position` to limit the size.
 * @example
 * ```tsx
 * <Box height={500} width={650} style={{ position: "relative", border: "2px solid gray" }}>
 * 	<CustomConsole resizable={false} />
 * </Box>
 * ```
 * @param props The props of the console.
 * @param {boolean} [props.resizable=true] If the console is resizable, default is true. If not resizable, the console will take the full height.
 * @returns The console that displays the execution log and errors.
 */
export const CustomConsole = ({ resizable = true }: { resizable?: boolean }) => {
	const paperRef = useRef<HTMLDivElement>(null);

	return (
		<Overlap height={"100%"} width={"100%"} style={{ position: "absolute", top: 0, pointerEvents: "none" }}>
			<Vertical justifyContent="flex-end" style={{ zIndex: 200, pointerEvents: "none", margin: "-1px 0" }}>
				{globalState.isConsoleDisplayed.value && (
					<>
						{resizable && (
							<Paper
								onMouseDown={startResize}
								onMouseEnter={() => (isHandleHovered.value = true)}
								onMouseLeave={() => (isHandleHovered.value = false)}
								onTouchStart={startResize}
								style={{
									cursor: "ns-resize",
									backgroundColor:
										isHandleHovered.value || isConsoleResizing.value ? "var(--mantine-primary-color-filled)" : undefined,
									borderRadius: 0,
									display: "flex",
									justifyContent: "center",
									pointerEvents: "auto",
									borderBottom: 0,
								}}
								withBorder
							>
								<ThemeIcon size="xs" variant="transparent">
									<GripHorizontal />
								</ThemeIcon>
							</Paper>
						)}
						<Paper
							ref={paperRef}
							withBorder
							style={{ height: resizable ? globalState.consoleHeight.value : "100%", pointerEvents: "auto", overflow: "auto" }}
						>
							{globalState.logList.value.map((log, index) => {
								const isLogToSee = globalState.logList.value.length - index <= globalState.logToSeeCount.value;
								return (
									<Horizontal
										// eslint-disable-next-line react/no-array-index-key
										key={index}
										gap={8}
										style={{
											padding: "4px 8px",
											background: isLogToSee ? "var(--mantine-primary-color-light)" : undefined,
											cursor: isLogToSee ? "pointer" : undefined,
										}}
										alignItems="baseline"
										onClick={() => isLogToSee && (globalState.logToSeeCount.value = globalState.logList.value.length - index - 1)}
									>
										<Text
											c={log.type === "error" ? "red" : log.type === "warn" ? "yellow" : log.type === "info" ? "blue" : "gray"}
											style={{ whiteSpace: "pre", fontFamily: "consolas" }}
										>
											{`[${log.type}]`.padEnd(7)}
										</Text>
										<Text style={{ whiteSpace: "pre", fontFamily: "consolas" }}>[{log.time}]</Text>
										<Tooltip label="Press Alt+Z to toggle wrap" hidden={log.message.length < 100}>
											<Text style={{ whiteSpace: "pre", fontFamily: "consolas", textWrapMode: isWrap.value ? "wrap" : "nowrap" }}>
												{log.message}
											</Text>
										</Tooltip>
									</Horizontal>
								);
							})}
						</Paper>
					</>
				)}
				<Horizontal gap={12} style={{ background: "var(--mantine-color-body)" }}>
					<Indicator
						label={globalState.logToSeeCount.value}
						disabled={globalState.logToSeeCount.value === 0}
						color={"red"}
						position="top-end"
						size={25}
						flex={1}
					>
						<Button
							onClick={() => (
								(globalState.isConsoleDisplayed.value = !globalState.isConsoleDisplayed.value),
								globalState.isConsoleDisplayed.value && (globalState.logToSeeCount.value = 0)
							)}
							size="compact-xs"
							style={{ pointerEvents: "auto" }}
							fullWidth
						>
							Console
						</Button>
					</Indicator>
					<ActionIcon
						size={24}
						style={{ margin: "-6px 0", scale: 0.8, pointerEvents: "auto" }}
						onClick={() => ((globalState.logList.value = []), (globalState.logToSeeCount.value = 0))}
					>
						<GrClear />
					</ActionIcon>
				</Horizontal>
			</Vertical>
		</Overlap>
	);
};

const oldConsoleLog = console.log;
const oldConsoleInfo = console.info;
const oldConsoleWarn = console.warn;
const oldConsoleError = console.error;

const newConsoleLogFn =
	(type: LogType) =>
	(...args: unknown[]) => (
		(globalState.logList.value = [
			...globalState.logList.peek(),
			{
				type,
				time: new Date().toISOString().split("T")[1],
				message: args
					.map((arg) =>
						typeof arg === "string" ? arg : arg instanceof Error ? `${arg.message}\n${arg.stack}` : JSON.stringify(arg)
					)
					.join(" "),
			},
		]),
		(globalState.logToSeeCount.value = globalState.logToSeeCount.peek() + 1)
	);

/**
 * Type of the console: normal for the default console, custom for the custom console, both for both.
 */
export type ConsoleType = "normal" | "custom" | "both";

/**
 * Update the functions `console.log`, `console.info`, ... according to the given type.
 * @param type the type of the console
 */
export const setConsoleType = (type: ConsoleType) => {
	if (type === "normal") {
		console.log = oldConsoleLog;
		console.info = oldConsoleInfo;
		console.warn = oldConsoleWarn;
		console.error = oldConsoleError;
	} else if (type === "custom") {
		console.log = newConsoleLogFn("log");
		console.info = newConsoleLogFn("info");
		console.warn = newConsoleLogFn("warn");
		console.error = newConsoleLogFn("error");
	} else {
		console.log = (...args: unknown[]) => (oldConsoleLog(...args), newConsoleLogFn("log")(...args));
		console.info = (...args: unknown[]) => (oldConsoleInfo(...args), newConsoleLogFn("info")(...args));
		console.warn = (...args: unknown[]) => (oldConsoleWarn(...args), newConsoleLogFn("warn")(...args));
		console.error = (...args: unknown[]) => (oldConsoleError(...args), newConsoleLogFn("error")(...args));
	}
};
