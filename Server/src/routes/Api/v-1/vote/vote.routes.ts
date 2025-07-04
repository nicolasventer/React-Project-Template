import { checkRole } from "@/elysiaPlugins";
import { impl } from "@/impl";
import {
	checkRoleSchema,
	CreateVoteSchema,
	HeadersSchema,
	IdNumSchema,
	UpdateVoteSchema,
	VoteOutputSchema,
} from "@/Shared/SharedModel";
import { Elysia, t } from "elysia";

export const voteApp = new Elysia({ prefix: "/votes", tags: ["votes"] })
	.use(checkRole)
	.post("", (req) => impl.vote.create(req, req.body), {
		headers: HeadersSchema,
		body: CreateVoteSchema,
		detail: { summary: "Create a vote" },
		response: {
			200: VoteOutputSchema,
			401: checkRoleSchema("*"),
		},
		checkRole: "*",
	})
	.patch("/:id", (req) => impl.vote.update(req, req.params, req.body), {
		headers: HeadersSchema,
		body: UpdateVoteSchema,
		params: IdNumSchema,
		detail: { summary: "Update a vote" },
		response: {
			200: t.Literal("Vote updated"),
			401: checkRoleSchema("*"),
			404: t.Literal("Vote not found"),
		},
		checkRole: "*",
	})
	.delete("/:id", (req) => impl.vote.delete(req, req.params), {
		headers: HeadersSchema,
		params: IdNumSchema,
		detail: { summary: "Delete a vote" },
		response: {
			200: t.Literal("Vote deleted"),
			401: checkRoleSchema("*"),
			404: t.Literal("Vote not found"),
		},
		checkRole: "*",
	});
