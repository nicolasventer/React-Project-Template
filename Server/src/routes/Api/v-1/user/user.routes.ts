import { impl } from "@/impl";
import { CreateUserSchema, HeadersSchema, IdNumSchema, UpdateUserSchema } from "@/Shared/SharedModel";
import { Elysia } from "elysia";

export const userApp = new Elysia({ prefix: "/users" })
	// create a user
	.post("", (req) => impl.user.create(req, req.body), { headers: HeadersSchema, body: CreateUserSchema })
	// get all users
	.get("", (req) => impl.user.getAll(req))
	// update a user by id
	.patch("/:id", (req) => impl.user.update(req, req.params, req.body), { body: UpdateUserSchema, params: IdNumSchema })
	// update self
	.patch("/current", (req) => impl.user.updateSelf(req, req.body), { body: UpdateUserSchema })
	// delete a user by id
	.delete("/:id", (req) => impl.user.delete(req, req.params), { params: IdNumSchema })
	// delete self
	.delete("/current", (req) => impl.user.deleteSelf(req));
