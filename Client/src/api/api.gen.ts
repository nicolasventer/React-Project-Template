import type { LanguageType, PermissionType } from "@/Shared/SharedModel";
import type { Treaty } from "@elysiajs/eden";

type GoodTreatyResponse<T extends Record<number, unknown>> = Treaty.TreatyResponse<T>;
type TreatyResponse<T extends Record<number, unknown>> = { [K in keyof T]: GoodTreatyResponse<{ [_ in K]: T[K] }> }[keyof T];

/**
 * @ignore
 * Type definition for the API object, retrieved from the server
 */
export type Api = {
	status: {
		get: (
			options?:
				| {
						headers?: Record<string, unknown> | undefined;
						query?: Record<string, unknown> | undefined;
						fetch?: RequestInit | undefined;
				  }
				| undefined
		) => Promise<TreatyResponse<{ 200: string }>>;
	};
	"dyn-dict": ((params: { language: LanguageType }) => {
		get: (
			options?:
				| {
						headers?: Record<string, unknown> | undefined;
						query?: Record<string, unknown> | undefined;
						fetch?: RequestInit | undefined;
				  }
				| undefined
		) => Promise<TreatyResponse<{ 200: { test: Record<string, string> } }>>;
	}) & {};
	users: {
		get: (
			options?:
				| {
						headers?: Record<string, unknown> | undefined;
						query?: Record<string, unknown> | undefined;
						fetch?: RequestInit | undefined;
				  }
				| undefined
		) => Promise<
			TreatyResponse<{
				200: { name: string; email: string; permissions: ("delete" | "create" | "update" | "read" | "admin")[] }[];
			}>
		>;
		find: {
			post: (
				body: {
					name?: string | undefined;
					email?: string | undefined;
					permissions?: ("delete" | "create" | "update" | "read" | "admin")[] | undefined;
				} | null,
				options?:
					| {
							headers?: Record<string, unknown> | undefined;
							query?: Record<string, unknown> | undefined;
							fetch?: RequestInit | undefined;
					  }
					| undefined
			) => Promise<
				TreatyResponse<{
					200: { name: string; email: string; permissions: ("delete" | "create" | "update" | "read" | "admin")[] }[];
				}>
			>;
		};
	};
	user: ((params: { email: string | number }) => {
		get: (
			options?:
				| {
						headers?: Record<string, unknown> | undefined;
						query?: Record<string, unknown> | undefined;
						fetch?: RequestInit | undefined;
				  }
				| undefined
		) => Promise<
			TreatyResponse<{
				200: { name: string; email: string; permissions: ("delete" | "create" | "update" | "read" | "admin")[] };
				404: "User not found";
			}>
		>;
		delete: (
			body?: unknown,
			options?:
				| {
						headers?: Record<string, unknown> | undefined;
						query?: Record<string, unknown> | undefined;
						fetch?: RequestInit | undefined;
				  }
				| undefined
		) => Promise<TreatyResponse<{ 200: "User deleted"; 404: "User not found" }>>;
	}) & {
		post: (
			body: { name: string; email: string; permissions: PermissionType[] },
			options?:
				| {
						headers?: Record<string, unknown> | undefined;
						query?: Record<string, unknown> | undefined;
						fetch?: RequestInit | undefined;
				  }
				| undefined
		) => Promise<
			TreatyResponse<{
				200: { name: string; email: string; permissions: ("delete" | "create" | "update" | "read" | "admin")[] };
				409: "User already exists";
			}>
		>;
		put: (
			body: { name: string; email: string; permissions: PermissionType[] },
			options?:
				| {
						headers?: Record<string, unknown> | undefined;
						query?: Record<string, unknown> | undefined;
						fetch?: RequestInit | undefined;
				  }
				| undefined
		) => Promise<
			TreatyResponse<{
				200: { name: string; email: string; permissions: ("delete" | "create" | "update" | "read" | "admin")[] };
				404: "User not found";
			}>
		>;
	};
};
