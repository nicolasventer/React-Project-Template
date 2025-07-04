import { impl } from "@/impl";
import { buildUnauthorizedSchema, MultiImageOutputSchema } from "@/Shared/SharedModel";
import { Elysia, t } from "elysia";

export const imageApp = new Elysia({ prefix: "/images", tags: ["images"] })
	// get all images with optionally the user's votes
	.get("", (req) => impl.image.getAll(req), {
		detail: { summary: "Get all images" },
		headers: t.Optional(
			t.Object({ "x-token": t.String() }, { description: "optional login token that can be specified to get the user's votes" })
		),
		response: { 200: MultiImageOutputSchema, 401: buildUnauthorizedSchema(["Token expired", "Invalid token"] as const) },
	});
