import { dynDictApp } from "@/routes/Api/V1/DynDict/dynDict.routes";
import { userApp } from "@/routes/Api/V1/ExampleUser/exampleUser.routes";
import Elysia from "elysia";

export const v1App = new Elysia({ prefix: "/v1" })
	// get status
	.get("", () => "v1 is running")
	// use dynDictApp
	.use(dynDictApp)
	// use userApp
	.use(userApp);
