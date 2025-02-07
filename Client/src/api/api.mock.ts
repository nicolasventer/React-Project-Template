import type { Api } from "@/api/api.gen";
import type { DynDict, ExampleUser } from "@/Shared/SharedModel";
import type { Treaty } from "@elysiajs/eden";

type TreatyResponse<T extends Record<number, unknown>> = Treaty.TreatyResponse<T>;

const getDefault = <T>(obj: { default: T }) => obj.default;

const users_ = () => import("@/assets/data/Users.json").then(getDefault) as Promise<ExampleUser[]>;
let usersCache: ExampleUser[] = []; // only for simulation of update and delete, (generally users_ is called)
const users = () => (usersCache.length ? Promise.resolve(usersCache) : users_().then((data) => (usersCache = data)));

const mockResponse = <T>(data: T): TreatyResponse<{ 200: T }> => ({
	data,
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

const as_ = <T>(data: T) => data;

const mockDynDict: DynDict<string> = {
	en: { test: { dynamic_english: "Mocked dynamic_english" } },
	fr: { test: { dynamic_english: "francais_dynamique fictif" } },
} satisfies DynDict<"dynamic_english">;

export const apiMock: Api = {
	get: () => Promise.resolve(mockResponse("Server is mocked")),
	v1: {
		get: () => Promise.resolve(mockResponse("API v1 is mocked")),
		"dyn-dict": ({ language }) => ({
			get: () => Promise.resolve(mockResponse(mockDynDict[language])),
		}),
		users: Object.assign(
			({ email }: { email: string | number }) => ({
				get: () =>
					users().then((data) => {
						const user = data.find((u) => u.email === email);
						if (!user) return mockNotFound("User not found");
						return mockResponse(user);
					}),
				delete: () =>
					users().then((data) => {
						const userIndex = data.findIndex((u) => u.email === email);
						if (userIndex === -1) return mockNotFound("User not found");
						data.splice(userIndex, 1);
						return mockResponse("User deleted");
					}),
			}),
			as_<Pick<Api["v1"]["users"], "get" | "find" | "post" | "put">>({
				get: () => users().then((data) => mockResponse(data)),
				find: {
					post: (body) =>
						users().then((data) => {
							if (!body) return mockResponse(data);
							const filtered = data.filter((u) => {
								if (body.name && u.name !== body.name) return false;
								if (body.email && u.email !== body.email) return false;
								if (body.permissions && !body.permissions.every((p) => u.permissions.includes(p))) return false;
								return true;
							});
							return mockResponse(filtered);
						}),
				},
				post: (body) =>
					users().then((data) => {
						const user = data.find((u) => u.email === body.email);
						if (user) return mockNotFound("User already exists");
						data.push(body);
						return mockResponse(body);
					}),
				put: (body) =>
					users().then((data) => {
						const userIndex = data.findIndex((u) => u.email === body.email);
						if (userIndex === -1) return mockNotFound("User not found");
						data[userIndex] = body;
						return mockResponse(body);
					}),
			})
		),
	},
};
