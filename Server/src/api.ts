import type { App } from "@/index";
import { treaty } from "@elysiajs/eden";

// variable used to generate the type of the API in the client (c.f. _genApi.ts)
const _api = treaty<App>("").api;
