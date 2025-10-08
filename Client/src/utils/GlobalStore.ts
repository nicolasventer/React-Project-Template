/* eslint-disable @typescript-eslint/no-explicit-any */
import { useCallback, useDebugValue, useEffect, useRef, useState } from "react";

/**
 * Global State Management System
 *
 * This module provides a reactive global state management solution that allows components
 * to subscribe to specific parts of a global state object and automatically re-render
 * when those parts change. It uses a proxy-based approach to track property access
 * and a listener system to notify subscribers of changes.
 *
 * Key Features:
 * - Automatic dependency tracking through property access
 * - Granular subscriptions to specific state paths
 * - Cascade notifications (parent changes notify child subscribers)
 * - Type-safe state access with TypeScript
 * - React integration with hooks
 */

/**
 * Sets a value at a specific path in the target object
 * @param target - The object to modify
 * @param path - Array of property names representing the path
 * @param newValue - The new value to set
 */
const setValue = (target: any, path: string[], newValue: unknown) => {
	let current = target;
	// Navigate to the parent of the target property
	for (let i = 0; i < path.length - 1; i++) {
		const p = path[i];
		current = current[p];
	}
	// Set the final property value
	current[path[path.length - 1]] = newValue;
};

/**
 * Global variable that maps state paths to their exact listeners (only direct property changes)
 * Key: dot-separated path string (e.g., "user.profile.name")
 * Value: Array of refresh functions to call when this exact path changes
 */
const _exactListenerListMap = new Map<string, (() => void)[]>();

/**
 * Global variable that maps state paths to their cascade listeners (parent changes notify children)
 * Key: dot-separated path string (e.g., "user.profile")
 * Value: Array of refresh functions to call when this path or any child changes
 */
const _cascadeListenerListMap = new Map<string, (() => void)[]>();

/**
 * Global variables used during state access tracking
 * These are used by the proxy to track which properties are being accessed
 */
const _use_path: string[] = [];
let _use_target: unknown | undefined = undefined;

/**
 * Hook for accessing and updating global state with automatic dependency tracking
 *
 * This hook allows components to subscribe to specific parts of the global state
 * and automatically re-render when those parts change. The callback function
 * is used to access the state, and the proxy system tracks which properties
 * are accessed to set up the appropriate listeners.
 *
 * @param callback - Function that accesses the global state and returns the desired value
 * @param debugLabel - Optional label for React DevTools debugging
 * @returns A tuple containing the current state value and a setter function
 *
 * @example
 * ```tsx
 * const globalState = stateProxy({
 *   user: { name: "John", age: 30 },
 *   settings: { theme: "dark" }
 * });
 * const [userName, setUserName] = useGlobalState(() => globalState.user.name);
 * const [userAge, setUserAge] = useGlobalState(() => globalState.user.age);
 * ```
 */
export const useGlobalState = <T>(callback: () => T, debugLabel?: string) => {
	// Track the path of properties accessed during the callback
	const [path, setPath] = useState<string[]>([]);
	// Reference to the target object being accessed
	const target = useRef<any>(undefined);

	// Initial state calculation and path tracking
	const [s, setS] = useState(() => {
		// Reset the path tracking array
		_use_path.length = 0;
		// Execute the callback, which will trigger proxy property access
		const result = callback();
		// Store the target object that was accessed
		target.current = _use_target;
		// Store the path of properties that were accessed
		setPath([..._use_path]);
		return result;
	});
	// Set up listeners for state changes
	useEffect(() => {
		// Skip if no path not yet set
		if (!path.length) return;

		// Function to refresh the component when state changes
		const refreshValue = () => setS(callback());

		// Register cascade listeners for all parent paths
		// This ensures that changes to parent objects also trigger updates
		let cumulativePath = "";
		for (const p of path) {
			const pathString = cumulativePath + p;
			const listenerList = _cascadeListenerListMap.get(pathString);
			_cascadeListenerListMap.set(pathString, [...(listenerList ?? []), refreshValue]);
			cumulativePath += p + ".";
		}

		// Register exact listener for the final path
		// This ensures that direct changes to the accessed property trigger updates
		const pathString = cumulativePath.slice(0, -1);
		const listenerList = _exactListenerListMap.get(pathString);
		_exactListenerListMap.set(pathString, [...(listenerList ?? []), refreshValue]);

		// Cleanup function to remove listeners when component unmounts or path changes
		return () => {
			let cumulativePath = "";
			// Remove cascade listeners
			for (const p of path) {
				const pathString = cumulativePath + p;
				const listenerList = _cascadeListenerListMap.get(pathString);
				_cascadeListenerListMap.set(pathString, listenerList?.filter((v) => v !== refreshValue) ?? []);
				cumulativePath += p + ".";
			}
			// Remove exact listener
			const pathString = cumulativePath.slice(0, -1);
			const listenerList = _exactListenerListMap.get(pathString);
			_exactListenerListMap.set(pathString, listenerList?.filter((v) => v !== refreshValue) ?? []);
		};
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [path]);
	// Create the setter function that updates state and notifies listeners
	const newSetS: typeof setS = useCallback(
		(newValue) => {
			// Handle function updates (like setState with a function)
			// @ts-expect-error newValue is a function
			if (typeof newValue === "function") return newSetS(newValue(s));

			// Update the actual state value
			setValue(target.current, path, newValue);

			// Notify exact listeners (direct property changes)
			let cumulativePath = "";
			for (const p of path) {
				const pathString = cumulativePath + p;
				_exactListenerListMap.get(pathString)?.forEach((refreshValue) => refreshValue());
				cumulativePath += p + ".";
			}

			// Notify cascade listeners (parent changes)
			const pathString = cumulativePath.slice(0, -1);
			_cascadeListenerListMap.get(pathString)?.forEach((refreshValue) => refreshValue());
		},
		[path, s]
	);

	// Add debug label for React DevTools
	useDebugValue(debugLabel);

	// Return the current state value and setter function
	return [s, newSetS] as const;
};
/**
 * Hook for read-only access to global state
 *
 * This is a convenience hook that only returns the current state value
 * without the setter function. Useful when you only need to read the state
 * and don't need to update it.
 *
 * @param callback - Function that accesses the global state and returns the desired value
 * @param debugLabel - Optional label for React DevTools debugging
 * @returns The current state value
 *
 * @example
 * ```tsx
 * const globalState = stateProxy({
 *   user: { name: "John", age: 30 },
 *   settings: { theme: "dark" }
 * });
 * const userName = useGlobal(() => globalState.user.name);
 * const userAge = useGlobal(() => globalState.user.age);
 * ```
 */
export const useGlobal = <T>(callback: () => T, debugLabel?: string) => {
	const [s] = useGlobalState(callback);
	useDebugValue(debugLabel);
	return s;
};

/**
 * Utility function to parse string keys as integers when accessing array indices
 * @param s - The string key to parse
 * @returns The parsed integer if valid, otherwise the original string
 */
const tryParseInt = (s: string) => {
	const n = parseInt(s);
	return isNaN(n) ? s : n;
};

/**
 * Internal recursive proxy function that creates reactive proxies for nested objects
 *
 * This function creates a Proxy that intercepts property access and assignment
 * to track dependencies and notify listeners when values change. It recursively
 * wraps nested objects to maintain reactivity throughout the object tree.
 *
 * @param target - The object to wrap with a proxy
 * @param fields - The current path of fields leading to this object
 * @returns A proxied version of the target object, or the original if not proxyable
 */
const stateProxy_ = <T extends object>(target: T, fields: string[]): T =>
	// Only create proxies for plain objects (not special objects like Date)
	typeof target === "object" && target !== null && target instanceof Date === false
		? (new Proxy(target, {
				// Intercept property access to track dependencies
				get: (_, field: string) => {
					const value = (target as any)[field];
					// Track this property access in the global path
					_use_path.push(field);
					// Store the root target object on first access
					if (fields.length === 0) _use_target = target;
					// Recursively wrap the accessed value
					return stateProxy_(value, [...fields, field]);
				},
				// Intercept property assignment to notify listeners
				set: (_, field: string, newValue) => {
					// Set the new value (handle array indices properly)
					(target as any)[Array.isArray(target) ? tryParseInt(field) : field] = newValue;

					// Notify exact listeners for this specific path
					let cumulativePath = "";
					for (const p of [...fields, field]) {
						const pathString = cumulativePath + p;
						_exactListenerListMap.get(pathString)?.forEach((refreshValue) => refreshValue());
						cumulativePath += p + ".";
					}

					// Notify cascade listeners for parent paths
					const pathString = cumulativePath.slice(0, -1);
					_cascadeListenerListMap.get(pathString)?.forEach((refreshValue) => refreshValue());
					return true;
				},
		  }) as T)
		: (target as T);

/**
 * Creates a reactive proxy for a global state object
 *
 * This is the main function used to make an object reactive. It wraps the object
 * with a Proxy that tracks property access and notifies listeners when properties
 * change. The returned object can be used with the useGlobalState and useGlobal hooks.
 *
 * @param target - The object to make reactive
 * @returns A reactive proxy of the target object
 *
 * @example
 * ```tsx
 * const globalState = stateProxy({
 *   user: { name: "John", age: 30 },
 *   settings: { theme: "dark" }
 * });
 * const userName = useGlobal(() => globalState.user.name);
 * const [userAge, setUserAge] = useGlobalState(() => globalState.user.age);
 * ```
 */
export const stateProxy = <T extends object>(target: T): T => stateProxy_(target, []);
