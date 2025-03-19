import { useMemo, type ReactNode } from "react";

/** The parameters of the MultiIf function */
export type MultiIfProps = {
	/** The values that the multi if should check for re-rendering */
	deps: unknown[];
	/** The branches of the multi if statement */
	branches: [condition: () => boolean, then: () => ReactNode][];
	/** The else branch, if none of the branches match */
	else?: () => ReactNode;
};

/**
 * A multi if statement in JSX.
 * @param props
 * @param props.branches the branches of the multi if statement
 * @param props.else the else branch, if none of the branches match
 * @returns the result of the multi if statement
 */
export const MultiIf = ({ deps, branches, else: else_ }: MultiIfProps) =>
	useMemo(() => {
		const branch = branches.find((branch) => branch[0]());
		const Component = branch ? branch[1] : else_ ?? (() => null);
		return <Component />;
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, deps);

/**
 * The parameters of the SwitchVComp function
 * @template T the type of the value
 * @template U the type of the transformed value
 */
export type SwitchVProps<T, U = T> = {
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
export const SwitchV = <T, U = T>({ value, transform, cases, defaultCase }: SwitchVProps<T, U>) =>
	useMemo(() => {
		const transformedValue = transform ? transform(value) : (value as unknown as U);
		const foundCase = cases.find(([u]) => u === transformedValue);
		const Component = foundCase ? foundCase[1] : defaultCase ?? (() => null);
		return <Component value={value} transformedValue={transformedValue} />;
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [value]);
