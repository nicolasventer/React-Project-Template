import { treaty } from "@elysiajs/eden";
import type { App } from ".";

// variable used to generate the type of the API in the client (c.f. _genApi.ts)
const _api = treaty<App>("").api;
