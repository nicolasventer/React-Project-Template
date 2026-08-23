import { app } from "@/testIndex";
import { afterAll, expect, test } from "bun:test";
import { api } from "./testUtils";

test("check server launched", async () => {
	const base = await api.get();
	expect(base.status).toBe(200);
});

afterAll(() => app.stop());
