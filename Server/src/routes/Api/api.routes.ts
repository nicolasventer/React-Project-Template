import { v1App } from "@/routes/Api/V1/v1.routes";
import Elysia from "elysia";

export const apiApp = new Elysia({ prefix: "/api" })
	// get status
	.get("", () => "api is running")
	// use v1App
	.use(v1App);
