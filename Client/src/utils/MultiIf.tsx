import type { ReactNode } from "react";

/**
 * A if statement in JSX.
 * @param props the props
 * @param props.condition the condition of the if statement
 * @param props.then the then branch of the if statement
 * @param props.else the else branch of the if statement
 * @returns the result of the if statement
 */
export const If = ({ condition, then, else: else_ }: { condition: boolean; then: ReactNode; else?: ReactNode }) => (
	<>{condition ? then : else_}</>
);

/**
 * A switch statement in JSX.
 * @param props the props
 * @param props.value the value to switch on
 * @param props.branches the branches of the switch statement
 * @param props.default the default branch, if none of the branches match
 * @returns the result of the switch statement
 */
export const Switch = <T,>({
	value,
	branches,
	default: default_,
}: {
	value: T;
	branches: { case: T | T[]; then: ReactNode }[];
	default?: ReactNode;
}) => {
	const branch = branches.find((branch) =>
		typeof branch.case === typeof value ? branch.case === value : (branch.case as T[]).includes(value)
	);
	return <>{branch !== undefined ? branch.then : default_}</>;
};

/**
 * A multi if statement in JSX.
 * @param props the props
 * @param props.branches the branches of the multi if statement
 * @param props.else the else branch, if none of the branches match
 * @returns the result of the multi if statement
 */
export const MultiIf = ({ branches, else: else_ }: { branches: { condition: boolean; then: ReactNode }[]; else?: ReactNode }) => {
	const branch = branches.find((branch) => branch.condition === true);
	return <>{branch !== undefined ? branch.then : else_}</>;
};
