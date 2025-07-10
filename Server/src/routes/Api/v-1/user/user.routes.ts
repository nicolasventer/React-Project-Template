import { impl } from "@/impl";
import {
	buildUnauthorizedSchema,
	CreateUserSchema,
	HeadersSchema,
	IdNumSchema,
	MultiUserOutputSchema,
	UpdateSelfUserSchema,
	UpdateUserOutputSchema,
	UpdateUserSchema,
	UserOutputSchema,
} from "@/Shared/SharedModel";
import { Elysia, t } from "elysia";

export const userApp = new Elysia({ prefix: "/users", tags: ["users"] })
	// create a user
	.post("", (req) => impl.user.create(req, req.body), {
		body: CreateUserSchema,
		detail: { summary: "Create a user" },
		response: {
			200: UserOutputSchema,
		},
	})
	// get all users
	.get("", (req) => impl.user.getAll(req), {
		headers: HeadersSchema,
		detail: { summary: "Get all users" },
		response: {
			200: MultiUserOutputSchema,
			401: buildUnauthorizedSchema(["Token expired", "Invalid token", "admin role required"] as const),
		},
	})
	// update a user by id
	.patch("/:id", (req) => impl.user.update(req, req.params, req.body), {
		headers: HeadersSchema,
		body: UpdateUserSchema,
		params: IdNumSchema,
		detail: { summary: "Update a user by id" },
		response: {
			200: UpdateUserOutputSchema,
			401: buildUnauthorizedSchema(["Token expired", "Invalid token", "admin role required"] as const),
		},
	})
	// update self
	.patch("/current", (req) => impl.user.updateSelf(req, req.body), {
		headers: HeadersSchema,
		body: UpdateSelfUserSchema,
		detail: { summary: "Update self" },
		response: {
			200: t.Literal("User updated"),
			401: buildUnauthorizedSchema(["Token expired", "Invalid token"] as const),
			404: t.Literal("User not found"),
		},
	})
	// delete a user by id
	.delete("/:id", (req) => impl.user.delete(req, req.params), {
		headers: HeadersSchema,
		params: IdNumSchema,
		detail: { summary: "Delete a user by id" },
		response: {
			200: UpdateUserOutputSchema,
			401: buildUnauthorizedSchema(["Token expired", "Invalid token", "admin role required"] as const),
		},
	})
	// delete self
	.delete("/current", (req) => impl.user.deleteSelf(req), {
		headers: HeadersSchema,
		detail: { summary: "Delete self" },
		response: {
			200: t.Literal("User deleted"),
			401: buildUnauthorizedSchema(["Token expired", "Invalid token"] as const),
			404: t.Literal("User not found"),
		},
	});
