import { impl } from "@/impl";
import { HeadersSchema } from "@/Shared/SharedModel";
import { Elysia } from "elysia";

export const imageApp = new Elysia({ prefix: "/images", tags: ["images"] })
	// get all images
	.get("", (req) => impl.image.getAll(req), { headers: HeadersSchema, detail: { summary: "Get all images" } })
	// get all images with the current user's votes
	.get("/current", (req) => impl.image.getAllSelf(req), {
		headers: HeadersSchema,
		detail: { summary: "Get all images with the current user's votes" },
	});
