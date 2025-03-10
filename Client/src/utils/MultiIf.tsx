import { useMemo, type ReactNode } from "react";

/**
 * A if statement in JSX.
 * @param props
 * @param props.condition the condition of the if statement
 * @param props.then the then branch of the if statement
 * @param props.else the else branch of the if statement
 * @returns the result of the if statement
 */
export const If = ({ condition, then, else: else_ }: { condition: boolean; then: () => ReactNode; else?: () => ReactNode }) =>
	// eslint-disable-next-line react-hooks/exhaustive-deps
	useMemo(() => <>{condition ? then() : else_?.()}</>, [condition]);

/**
 * The parameters of the SwitchV function
 * @template T the type of the value
 * @template V the type of the result
 * @template U the type of the transformed value
 */
export type SwitchVProps<T, V, U = T> = {
	/** The value to pass to the cases */
	value: T;
	/** The function to transform the value before passing it to the cases (default: identity function) */
	transform?: (v: T) => U;
	/** The branches of the switch statement */
	cases: [U, (t: T, u: U) => V][];
	/** The default branch, if none of the branches match */
	defaultCase?: (t: T, u: U) => V;
};

/**
 * A switch statement.
 * @template T the type of the value
 * @template V the type of the result
 * @template U the type of the transformed value
 * @param props
 * @param props.value the value to pass to the cases
 * @param props.transform the function to transform the value before passing it to the cases (default: identity function)
 * @param props.cases the branches of the switch statement
 * @param props.defaultCase the default branch, if none of the branches match
 * @returns the result of the switch statement
 */
export const SwitchV = <T, V, U = T>({ value, transform, cases, defaultCase }: SwitchVProps<T, V, U>) => {
	const transformedValue = transform ? transform(value) : (value as unknown as U);
	const foundCase = cases.find(([u]) => u === transformedValue);
	return foundCase ? foundCase[1](value, transformedValue) : defaultCase?.(value, transformedValue);
};

/**
 * The parameters of the SwitchVComp function
 * @template T the type of the value
 * @template U the type of the transformed value
 */
export type SwitchVCompProps<T, U = T> = {
	/** The value to pass to the cases */
	value: T;
	/** The function to transform the value before passing it to the cases (default: identity function) */
	transform?: (v: T) => U;
	/** The branches of the switch statement */
	cases: [U, (props: { value: T; transformedValue: U }) => ReactNode][];
	/** The default branch, if none of the branches match */
	defaultCase?: (props: { value: T; transformedValue: U }) => ReactNode;
};

/**
 * @see {@link SwitchV}
 * A switch statement component in JSX.
 * @template T the type of the value
 * @template U the type of the transformed value
 * @param props
 * @param props.value the value to pass to the cases
 * @param props.transform the function to transform the value before passing it to the cases (default: identity function)
 * @param props.cases the branches of the switch statement
 * @param props.defaultCase the default branch, if none of the branches match
 * @returns the result of the switch statement
 */
export const SwitchVComp = <T, U = T>({ value, transform, cases, defaultCase }: SwitchVCompProps<T, U>) =>
	useMemo(() => {
		const transformedValue = transform ? transform(value) : (value as unknown as U);
		const foundCase = cases.find(([u]) => u === transformedValue);
		const Component = foundCase ? foundCase[1] : (defaultCase ?? (() => null));
		return <Component value={value} transformedValue={transformedValue} />;
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [value]);

/**
 * A multi if statement in JSX.
 * @param props
 * @param props.branches the branches of the multi if statement
 * @param props.else the else branch, if none of the branches match
 * @returns the result of the multi if statement
 */
export const MultiIf = ({
	branches,
	else: else_,
}: {
	branches: { condition: boolean; then: () => ReactNode }[];
	else?: () => ReactNode;
}) =>
	useMemo(() => {
		const branch = branches.find((branch) => branch.condition);
		return <>{branch ? branch.then() : else_?.()}</>;
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [branches]);
