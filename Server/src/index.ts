import cors from "@elysiajs/cors";
import type { treaty } from "@elysiajs/eden";
import swagger from "@elysiajs/swagger";
import Elysia from "elysia";
import { PORT, SRV_URL } from "./Shared/SharedConfig";
import { ExampleUserSchema, FindUserSchema, GetDynDictSchema } from "./Shared/SharedModel";
import { getDynDict } from "./dynDict";
import { createUser, deleteUser, findUsers, getUser, updateUser } from "./exampleUser";

/**
 * @ignore See documentation in the swagger description.
 * The Elysia server.
 */
export const app = new Elysia()
	.use(cors())
	.use(swagger())
	.get("/", () => "Server is running")
	// get status
	.get("/api/status", () => "Status ok")
	// get dynamic dictionary
	.get("/api/dyn-dict/:language", (req) => getDynDict(req, req.params), { params: GetDynDictSchema })
	// get all users
	.get("/api/users", (req) => findUsers(req))
	// get a user by email
	.get("/api/user/:email", (req) => getUser(req, req.params))
	// get users by query
	.post("/api/users/find", (req) => findUsers(req, req.body), { body: FindUserSchema })
	// create a user
	.post("/api/user", (req) => createUser(req, req.body), { body: ExampleUserSchema })
	// update a user
	.put("/api/user", (req) => updateUser(req, req.body, req.body), { body: ExampleUserSchema })
	// delete a user by email
	.delete("/api/user/:email", (req) => deleteUser(req, req.params))
	.listen(PORT);

/**
 * @ignore
 * The type of the app (used in api.ts).
 */
export type App = typeof app;

/**
 * @ignore
 * The type of the API (copy-pasted from the client).
 */
export type Api = ReturnType<typeof treaty<App>>["api"];

console.log(`Server started on ${SRV_URL}`);
console.log(`Swagger available on ${SRV_URL}/swagger`);
