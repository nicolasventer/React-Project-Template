import { afterAll, expect, test } from "bun:test";
import { app } from "../src/testIndex";
import { api } from "./testUtils";

test("check server launched", async () => {
	const base = await api.status.get();
	expect(base.status).toBe(200);
});

afterAll(() => app.stop());
