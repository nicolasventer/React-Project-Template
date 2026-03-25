/* eslint-disable @typescript-eslint/no-explicit-any */
import type { Api } from "@/api/api.gen";

/*
type TreatyResponse<T extends Record<number, unknown>> = Treaty.TreatyResponse<T>; // TODO: export

const mockResponse = <T>(data: T): TreatyResponse<{ 200: T; 422: any }> => ({
	data: data as NonNullable<TreatyResponse<{ 200: T }>["data"]>,
	error: null,
	response: new Response(),
	status: 200,
	headers: undefined,
});
const mockNotFound = (message: string): TreatyResponse<{ 404: string }> => ({
	data: null,
	error: { value: message, status: 404 },
	response: new Response(),
	status: 404,
	headers: undefined,
});
*/

const buildFn =
	(path: string[], root: Record<string, any>) =>
	(...params: any[]) => {
		// console.log(`Calling ${path.join(".")}(${params.map((p) => JSON.stringify(p)).join(", ")})`);
		return BuildProxy([...path, JSON.stringify(params)], root);
	};

const BuildProxy = <T extends object>(path: string[] = [], root: Record<string, any> = {}): T => {
	return new Proxy<T>(buildFn(path, root) as T, {
		get: (_, prop: string) => root[path.join(".")] ?? BuildProxy<T>([...path, prop], root),
		set: (_, _prop: string, value: any) => {
			root[path.join(".")] = value;
			return true;
		},
	});
};

/*
const _nothingFn = () => {};

type NothingFn = typeof _nothingFn;

type ObjProps<T extends (...params: any[]) => unknown> = {
	[K in keyof T]: K extends keyof NothingFn ? never : T[K];
};

const funcWithProps = <T extends (...params: any[]) => unknown>(
	func: (...params: Parameters<T>) => ReturnType<T>,
	props: ObjProps<T>,
) => Object.assign(func, props) as T;
*/

export const apiMock = BuildProxy<Api>();
