/* eslint-disable @typescript-eslint/no-explicit-any */
import type { Store } from "@/utils/Store";
import { store } from "@/utils/Store";
import type { ComponentType } from "react";

type PropsOf<T extends ComponentType<unknown>> = T extends ComponentType<infer P> ? P : never;

/**
 * The function to use to wrap a component with a preview component.
 * @param Comp - The component.
 * @param PreviewComp - The preview representation of the component.
 * @returns The component or the preview component depending on the preview state (@see {@link configurePreview}).
 */
export let withPreview: <T extends ComponentType<any>>(Comp: T, PreviewComp: T) => T = (Comp) => Comp;

/**
 * @param previewType - The type of preview to use, "dynamic" should be used only in development mode.
 * @param initialValue - The initial value of the preview.
 * @returns The store of the preview if previewType is "dynamic", otherwise it returns nothing.
 */
export function configurePreview(previewType: "static", initialValue: boolean): void;
export function configurePreview(previewType: "dynamic", initialValue: boolean): Store<boolean>;
export function configurePreview(previewType: "static" | "dynamic", initialValue: boolean) {
	if (previewType === "static") {
		withPreview = initialValue
			? <T extends ComponentType<any>>(_: T, PreviewComp: T) => PreviewComp
			: <T extends ComponentType<any>>(Comp: T, _: T) => Comp;
	} else {
		const bPreview = store(initialValue, "bPreview");
		const usePreview = () => bPreview.use(); // custom hook required by the react-compiler
		withPreview = <T extends ComponentType<any>>(Comp: T, PreviewComp: T) => {
			const Preview = (props: PropsOf<T>) => (usePreview() ? <PreviewComp {...props} /> : <Comp {...props} />);
			return Preview as T;
		};
		return bPreview;
	}
}
