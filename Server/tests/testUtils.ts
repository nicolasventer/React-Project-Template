import { treaty } from "@elysiajs/eden";
import type { Api } from "../src";
import { SRV_URL } from "../src/Common/CommonConfig";

export const api = treaty(SRV_URL).api as Api;
