import { impl } from "@/impl";
import { CreateVoteSchema, HeadersSchema, IdNumSchema, UpdateVoteSchema } from "@/Shared/SharedModel";
import Elysia from "elysia";

export const voteApp = new Elysia({ prefix: "/votes" })
	.post("", (req) => impl.vote.create(req, req.body), { headers: HeadersSchema, body: CreateVoteSchema })
	.patch("/:id", (req) => impl.vote.update(req, req.params, req.body), {
		headers: HeadersSchema,
		body: UpdateVoteSchema,
		params: IdNumSchema,
	})
	.delete("/:id", (req) => impl.vote.delete(req, req.params), { headers: HeadersSchema, params: IdNumSchema });
