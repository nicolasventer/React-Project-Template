import { clearConsole, resizeConsole, toggleConsole, updateLogToSeeCount } from "@/features/_Common/common.setters";
import type { setConsoleType as _setConsoleType } from "@/features/_Common/CustomConsole/CustomConsole.utils";
import { gs } from "@/gs";
import { Horizontal, Vertical } from "@/libs/StrongBox/ComponentToolbox";
import { ActionIcon, Button, Indicator, Paper, Text, ThemeIcon, Tooltip } from "@mantine/core";
import { signal } from "@preact/signals";
import { GripHorizontal } from "lucide-react";
import { type MouseEventHandler, type TouchEventHandler } from "react";
import { GrClear } from "react-icons/gr";

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
	startConsoleHeight.value = gs.consoleHeight.value;
	isConsoleResizing.value = true;
	document.body.addEventListener("mousemove", resize);
	document.body.addEventListener("mouseup", stopResize);
	document.body.addEventListener("touchmove", resize);
	document.body.addEventListener("touchend", stopResize);
};

const resize = (ev: MouseEvent | TouchEvent) => {
	ev.stopPropagation();
	if (!isConsoleResizing.value) return;
	const clientY = ev instanceof MouseEvent ? ev.clientY : ev.touches[0].clientY;
	const newHeight = startConsoleHeight.value + mousePos.value.y - clientY;
	resizeConsole(newHeight, startConsoleHeight.value);
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
 * Be sure to call {@link _setConsoleType | setConsoleType("custom")} or {@link _setConsoleType | setConsoleType("both")} to use this console.\
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
export const CustomConsole = ({ resizable = true }: { resizable?: boolean }) => (
	<Vertical
		positionAbsolute
		heightFull
		widthFull
		justifyContent="flex-end"
		style={{ top: 0, zIndex: 200, pointerEvents: "none", margin: "-2px 0" }}
	>
		{gs.isConsoleDisplayed.value && (
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
							userSelect: "none",
						}}
						withBorder
					>
						<ThemeIcon size="xs" variant="transparent">
							<GripHorizontal />
						</ThemeIcon>
					</Paper>
				)}
				<Paper
					withBorder
					style={{ height: resizable ? gs.consoleHeight.value : "100%", pointerEvents: "auto", overflow: "auto" }}
				>
					{gs.logList.value.map((log, index) => {
						const isLogToSee = gs.logList.value.length - index <= gs.logToSeeCount.value;
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
								onClick={() => isLogToSee && updateLogToSeeCount(index)}
							>
								<Text
									c={log.type === "error" ? "red" : log.type === "warn" ? "yellow" : log.type === "info" ? "blue" : "gray"}
									style={{ whiteSpace: "pre", fontFamily: "consolas" }}
								>
									{`[${log.type}]`.padEnd(7)}
								</Text>
								<Text style={{ whiteSpace: "pre", fontFamily: "consolas" }}>[{log.time}]</Text>
								<Tooltip label="Press Alt+Z to toggle wrap" hidden={log.message.length < 100}>
									<Text
										style={{
											whiteSpace: "pre",
											fontFamily: "consolas",
											textWrapMode: isWrap.value ? "wrap" : "nowrap",
											overflowWrap: isWrap.value ? "anywhere" : undefined,
										}}
									>
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
				label={gs.logToSeeCount.value}
				disabled={gs.logToSeeCount.value === 0}
				color={"red"}
				position="top-end"
				size={25}
				flex={1}
			>
				<Button onClick={toggleConsole} size="compact-xs" style={{ pointerEvents: "auto" }} fullWidth>
					Console
				</Button>
			</Indicator>
			<ActionIcon size={24} style={{ margin: "-6px 0", scale: 0.8, pointerEvents: "auto" }} onClick={clearConsole}>
				<GrClear />
			</ActionIcon>
		</Horizontal>
	</Vertical>
);
