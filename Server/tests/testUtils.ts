import type { Api } from "@/index";
import { SRV_URL } from "@/Shared/SharedConfig";
import { treaty } from "@elysiajs/eden";

export const api = treaty(SRV_URL).api as unknown as Api;
