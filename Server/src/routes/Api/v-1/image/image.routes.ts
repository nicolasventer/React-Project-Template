import { impl } from "@/impl";
import { buildUnauthorizedSchema, HeadersSchema, MultiImageOutputSchema, MultiImageUserOutputSchema } from "@/Shared/SharedModel";
import { Elysia } from "elysia";

export const imageApp = new Elysia({ prefix: "/images", tags: ["images"] })
	// get all images
	.get("", (req) => impl.image.getAll(req), {
		headers: HeadersSchema,
		detail: { summary: "Get all images" },
		response: { 200: MultiImageOutputSchema },
	})
	// get all images with the current user's votes
	.get("/current", (req) => impl.image.getAllSelf(req), {
		headers: HeadersSchema,
		detail: { summary: "Get all images with the current user's votes" },
		response: {
			200: MultiImageUserOutputSchema,
			401: buildUnauthorizedSchema(["Token expired", "Invalid token"] as const),
		},
	});
