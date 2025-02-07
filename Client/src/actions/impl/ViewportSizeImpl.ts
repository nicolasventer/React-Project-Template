import type { IViewportSize } from "@/actions/actions.interface";
import { state } from "@/actions/actions.state";
import type { ViewportSize } from "@/actions/actions.types";

export class ViewportSizeImpl implements IViewportSize {
	update = (viewportSize: ViewportSize) => void (state.viewportSize.value = viewportSize);
}
