import { UserImpl } from "@/routes/Api/V1/ExampleUser/exampleUser.impl";
import { ExampleUserSchema, FindUserSchema } from "@/Shared/SharedModel";
import { Elysia } from "elysia";

const userImpl = new UserImpl();

export const userApp = new Elysia({ prefix: "/users" })
	// get all users
	.get("", (req) => userImpl.find(req))
	// get a user by email
	.get("/:email", (req) => userImpl.get(req, req.params))
	// get users by query
	.post("/find", (req) => userImpl.find(req, req.body), { body: FindUserSchema })
	// create a user
	.post("", (req) => userImpl.create(req, req.body), { body: ExampleUserSchema })
	// update a user
	.put("", (req) => userImpl.update(req, req.body, req.body), { body: ExampleUserSchema })
	// delete a user by email
	.delete("/:email", (req) => userImpl.delete(req, req.params));
