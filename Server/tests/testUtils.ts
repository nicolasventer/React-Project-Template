import { treaty } from "@elysiajs/eden";
import type { Api } from "../src";
import { SRV_URL } from "../src/Shared/SharedConfig";

export const api = treaty(SRV_URL).api as unknown as Api;
