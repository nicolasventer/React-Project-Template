import { impl } from "@/impl";
import { CreateUserSchema, HeadersSchema, IdNumSchema, UpdateSelfUserSchema, UpdateUserSchema } from "@/Shared/SharedModel";
import { Elysia } from "elysia";

export const userApp = new Elysia({ prefix: "/users", tags: ["users"] })
	// create a user
	.post("", (req) => impl.user.create(req, req.body), { body: CreateUserSchema, detail: { summary: "Create a user" } })
	// get all users
	.get("", (req) => impl.user.getAll(req), { headers: HeadersSchema, detail: { summary: "Get all users" } })
	// update a user by id
	.patch("/:id", (req) => impl.user.update(req, req.params, req.body), {
		headers: HeadersSchema,
		body: UpdateUserSchema,
		params: IdNumSchema,
		detail: { summary: "Update a user by id" },
	})
	// update self
	.patch("/current", (req) => impl.user.updateSelf(req, req.body), {
		headers: HeadersSchema,
		body: UpdateSelfUserSchema,
		detail: { summary: "Update self" },
	})
	// delete a user by id
	.delete("/:id", (req) => impl.user.delete(req, req.params), {
		headers: HeadersSchema,
		params: IdNumSchema,
		detail: { summary: "Delete a user by id" },
	})
	// delete self
	.delete("/current", (req) => impl.user.deleteSelf(req), { headers: HeadersSchema, detail: { summary: "Delete self" } });
