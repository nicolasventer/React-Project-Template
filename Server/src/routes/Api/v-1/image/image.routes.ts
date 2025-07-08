import { impl } from "@/impl";
import { HeadersSchema } from "@/Shared/SharedModel";
import { Elysia } from "elysia";

export const imageApp = new Elysia({ prefix: "/images" })
	// get all images
	.get("", (req) => impl.image.getAll(req), { headers: HeadersSchema })
	// get all images with the current user's vote
	.get("/current", (req) => impl.image.getAllSelf(req), { headers: HeadersSchema });
