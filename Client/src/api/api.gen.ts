import type { Treaty } from "@elysiajs/eden";

type TreatyResponse<T extends Record<number, unknown>> = Treaty.TreatyResponse<T>;

/**
 * @ignore
 * Type definition for the API object, retrieved from the server
 */
export type Api = {
	get: (
		options?:
			| {
					headers?: Record<string, unknown> | undefined;
					query?: Record<string, unknown> | undefined;
					fetch?: RequestInit | undefined;
			  }
			| undefined
	) => Promise<TreatyResponse<{ 200: string }>>;
	compile: {
		post: (
			body?: unknown,
			options?:
				| {
						headers?: Record<string, unknown> | undefined;
						query?: Record<string, unknown> | undefined;
						fetch?: RequestInit | undefined;
				  }
				| undefined
		) => Promise<
			TreatyResponse<{
				200: string | { error: string };
				401: "Token expired" | "Invalid token" | "superAdmin role required";
				422: {
					type: "validation";
					on: string;
					summary?: string | undefined;
					message?: string | undefined;
					found?: unknown;
					property?: string | undefined;
					expected?: string | undefined;
				};
			}>
		>;
	};
	execute: {
		post: (
			body: { body: any; url: string },
			options?:
				| {
						headers?: Record<string, unknown> | undefined;
						query?: Record<string, unknown> | undefined;
						fetch?: RequestInit | undefined;
				  }
				| undefined
		) => Promise<
			TreatyResponse<{
				200: Response;
				422: {
					type: "validation";
					on: string;
					summary?: string | undefined;
					message?: string | undefined;
					found?: unknown;
					property?: string | undefined;
					expected?: string | undefined;
				};
			}>
		>;
	};
	v1: {
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
				200: "v1 is running";
				422: {
					type: "validation";
					on: string;
					summary?: string | undefined;
					message?: string | undefined;
					found?: unknown;
					property?: string | undefined;
					expected?: string | undefined;
				};
			}>
		>;
		users: ((params: { id: string | number }) => {
			patch: (
				body: { role: "user" | "superAdmin" | "admin" },
				options: { headers: { "x-token": string }; query?: Record<string, unknown> | undefined; fetch?: RequestInit | undefined }
			) => Promise<
				TreatyResponse<{
					200: { userId: number };
					401: "Token expired" | "Invalid token" | "admin role required";
					422: {
						type: "validation";
						on: string;
						summary?: string | undefined;
						message?: string | undefined;
						found?: unknown;
						property?: string | undefined;
						expected?: string | undefined;
					};
				}>
			>;
			delete: (
				body: unknown,
				options: { headers: { "x-token": string }; query?: Record<string, unknown> | undefined; fetch?: RequestInit | undefined }
			) => Promise<
				TreatyResponse<{
					200: { userId: number };
					401: "Token expired" | "Invalid token" | "admin role required";
					422: {
						type: "validation";
						on: string;
						summary?: string | undefined;
						message?: string | undefined;
						found?: unknown;
						property?: string | undefined;
						expected?: string | undefined;
					};
				}>
			>;
		}) & {
			post: (
				body: { email: string; password: string },
				options?:
					| {
							headers?: Record<string, unknown> | undefined;
							query?: Record<string, unknown> | undefined;
							fetch?: RequestInit | undefined;
					  }
					| undefined
			) => Promise<
				TreatyResponse<{
					200: { userId: number; email: string; role: "user" | "superAdmin" | "admin"; lastLoginTime: number };
					422: {
						type: "validation";
						on: string;
						summary?: string | undefined;
						message?: string | undefined;
						found?: unknown;
						property?: string | undefined;
						expected?: string | undefined;
					};
				}>
			>;
			get: (options: {
				headers: { "x-token": string };
				query?: Record<string, unknown> | undefined;
				fetch?: RequestInit | undefined;
			}) => Promise<
				TreatyResponse<{
					200: { users: { userId: number; email: string; role: "user" | "superAdmin" | "admin"; lastLoginTime: number }[] };
					401: "Token expired" | "Invalid token" | "admin role required";
					422: {
						type: "validation";
						on: string;
						summary?: string | undefined;
						message?: string | undefined;
						found?: unknown;
						property?: string | undefined;
						expected?: string | undefined;
					};
				}>
			>;
			current: {
				patch: (
					body: { password: string },
					options: {
						headers: { "x-token": string };
						query?: Record<string, unknown> | undefined;
						fetch?: RequestInit | undefined;
					}
				) => Promise<
					TreatyResponse<{
						200: "User updated";
						401: "Token expired" | "Invalid token";
						404: "User not found";
						422: {
							type: "validation";
							on: string;
							summary?: string | undefined;
							message?: string | undefined;
							found?: unknown;
							property?: string | undefined;
							expected?: string | undefined;
						};
					}>
				>;
				delete: (
					body: unknown,
					options: {
						headers: { "x-token": string };
						query?: Record<string, unknown> | undefined;
						fetch?: RequestInit | undefined;
					}
				) => Promise<
					TreatyResponse<{
						200: "User deleted";
						401: "Token expired" | "Invalid token";
						404: "User not found";
						422: {
							type: "validation";
							on: string;
							summary?: string | undefined;
							message?: string | undefined;
							found?: unknown;
							property?: string | undefined;
							expected?: string | undefined;
						};
					}>
				>;
			};
		};
		auth: {
			login: {
				post: (
					body: { email: string; password: string },
					options?:
						| {
								headers?: Record<string, unknown> | undefined;
								query?: Record<string, unknown> | undefined;
								fetch?: RequestInit | undefined;
						  }
						| undefined
				) => Promise<
					TreatyResponse<{
						200: { role: "user" | "superAdmin" | "admin"; token: string };
						401: "Invalid email or password";
						422: {
							type: "validation";
							on: string;
							summary?: string | undefined;
							message?: string | undefined;
							found?: unknown;
							property?: string | undefined;
							expected?: string | undefined;
						};
					}>
				>;
			};
			token: {
				refresh: {
					get: (options: {
						headers: { "x-token": string };
						query?: Record<string, unknown> | undefined;
						fetch?: RequestInit | undefined;
					}) => Promise<
						TreatyResponse<{
							200: { role: "user" | "superAdmin" | "admin"; token: string };
							401: "Invalid token";
							422: {
								type: "validation";
								on: string;
								summary?: string | undefined;
								message?: string | undefined;
								found?: unknown;
								property?: string | undefined;
								expected?: string | undefined;
							};
						}>
					>;
				};
			};
		};
		password: {
			"request-reset": {
				post: (
					body: { email: string },
					options?:
						| {
								headers?: Record<string, unknown> | undefined;
								query?: Record<string, unknown> | undefined;
								fetch?: RequestInit | undefined;
						  }
						| undefined
				) => Promise<
					TreatyResponse<{
						200: "Reset password link sent" | { link: string };
						404: "User not found";
						500: "Failed to send reset password link";
						422: {
							type: "validation";
							on: string;
							summary?: string | undefined;
							message?: string | undefined;
							found?: unknown;
							property?: string | undefined;
							expected?: string | undefined;
						};
					}>
				>;
			};
			reset: {
				put: (
					body: { password: string },
					options?:
						| {
								headers?: Record<string, unknown> | undefined;
								query?: Record<string, unknown> | undefined;
								fetch?: RequestInit | undefined;
						  }
						| undefined
				) => Promise<
					TreatyResponse<{
						200: "Password updated";
						401: "Token expired" | "Invalid token";
						404: "User not found or token already used";
						422: {
							type: "validation";
							on: string;
							summary?: string | undefined;
							message?: string | undefined;
							found?: unknown;
							property?: string | undefined;
							expected?: string | undefined;
						};
					}>
				>;
			};
		};
		votes: ((params: { id: string | number }) => {
			patch: (
				body: { isPositive: boolean },
				options: { headers: { "x-token": string }; query?: Record<string, unknown> | undefined; fetch?: RequestInit | undefined }
			) => Promise<
				TreatyResponse<{
					200: "Vote updated";
					401: "Token expired" | "Invalid token";
					404: "Vote not found";
					422: {
						type: "validation";
						on: string;
						summary?: string | undefined;
						message?: string | undefined;
						found?: unknown;
						property?: string | undefined;
						expected?: string | undefined;
					};
				}>
			>;
			delete: (
				body: unknown,
				options: { headers: { "x-token": string }; query?: Record<string, unknown> | undefined; fetch?: RequestInit | undefined }
			) => Promise<
				TreatyResponse<{
					200: "Vote deleted";
					401: "Token expired" | "Invalid token";
					404: "Vote not found";
					422: {
						type: "validation";
						on: string;
						summary?: string | undefined;
						message?: string | undefined;
						found?: unknown;
						property?: string | undefined;
						expected?: string | undefined;
					};
				}>
			>;
		}) & {
			post: (
				body: { imageId: number; isPositive: boolean },
				options: { headers: { "x-token": string }; query?: Record<string, unknown> | undefined; fetch?: RequestInit | undefined }
			) => Promise<
				TreatyResponse<{
					200: { voteId: number };
					401: "Token expired" | "Invalid token";
					422: {
						type: "validation";
						on: string;
						summary?: string | undefined;
						message?: string | undefined;
						found?: unknown;
						property?: string | undefined;
						expected?: string | undefined;
					};
				}>
			>;
		};
		images: {
			get: (options: {
				headers: Partial<{ "x-token": string }>;
				query?: Record<string, unknown> | undefined;
				fetch?: RequestInit | undefined;
			}) => Promise<
				TreatyResponse<{
					200: {
						images: {
							url: string;
							imageId: number;
							positiveVotes: number;
							negativeVotes: number;
							totalVotes: number;
							score: number;
							userVote: number | null;
							userVoteId: number | null;
						}[];
					};
					401: "Token expired" | "Invalid token";
					422: {
						type: "validation";
						on: string;
						summary?: string | undefined;
						message?: string | undefined;
						found?: unknown;
						property?: string | undefined;
						expected?: string | undefined;
					};
				}>
			>;
		};
	};
};
