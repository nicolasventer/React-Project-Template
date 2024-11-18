/* eslint-disable @typescript-eslint/no-explicit-any */
import { type ReadonlySignal, signal } from "@preact/signals";
import { type FunctionComponent, lazy, Suspense } from "react";

type Params<T> = T extends (...args: [infer U]) => any ? U : Record<string, never>;

const Suspender = <T extends (...args: any) => any>(Comp: T) => {
	const Suspended = (props: Params<T>) => (
		<Suspense fallback>
			<Comp {...props} />
		</Suspense>
	);
	return Suspended;
};

type FCKeys<T extends object> = { [K in keyof T]: T[K] extends FunctionComponent<any> ? K : never }[keyof T];

/** The possible states of a loading operation. */
export type LoadingState = "notStarted" | "loading" | "loaded";

/**
 * A function that returns an object with functions to load and get components and with the loading state.
 * @template {object} T the type of the module
 * @param importFn the function that imports the module
 * @returns the object with the functions and the loading state
 */
export const lazyLoader = <T extends object>(importFn: () => Promise<T>) => {
	const loadingState = signal<LoadingState>("notStarted");
	const mod_ = signal<T>();

	const load = () => {
		if (!mod_.value) {
			loadingState.value = "loading";
			return importFn()
				.then((m) => (mod_.value = m))
				.then(() => (loadingState.value = "loaded"))
				.then(() => mod_.value!);
		}
		return new Promise<T>((resolve) => resolve(mod_.value!));
	};

	const getComponent = <U extends FCKeys<T>>(key: U) =>
		Suspender(lazy(() => load().then((modValue) => modValue[key] as FunctionComponent))) as T[U];

	return {
		/** The function to get the component. */
		getComponent,
		/** The function to load the module. */
		load,
		/** The loading state. */
		loadingState: loadingState as ReadonlySignal<LoadingState>,
	};
};

/**
 * The return type of the {@link lazySingleLoader} function.
 * @template T the type of the component
 */
export type LazySingleLoaderReturn<T> = {
	/** The component. */
	Component: T;
	/** The function to load the module. */
	load: () => Promise<unknown>;
	/** The loading state. */
	loadingState: ReadonlySignal<LoadingState>;
};

/**
 * A function that returns an object with a component, a function to load the module and the loading state.
 * @template {object} T the type of the module
 * @template {FCKeys<T>} U the key of the function component
 * @param importFn the function that imports the module
 * @param key the key of the function component
 * @returns the object with the component, the function and the loading state
 */
export const lazySingleLoader = <T extends object, U extends FCKeys<T>>(
	importFn: () => Promise<T>,
	key: U
): LazySingleLoaderReturn<T[U]> => {
	const loadingState = signal<LoadingState>("notStarted");
	const mod_ = signal<T>();

	const load = () => {
		if (!mod_.value) {
			loadingState.value = "loading";
			return importFn()
				.then((m) => (mod_.value = m))
				.then(() => (loadingState.value = "loaded"))
				.then(() => mod_.value!);
		}
		return new Promise<T>((resolve) => resolve(mod_.value!));
	};

	const Component = Suspender(lazy(() => load().then((modValue) => modValue[key] as FunctionComponent))) as T[U];

	return { Component, load, loadingState: loadingState as ReadonlySignal<LoadingState> };
};
