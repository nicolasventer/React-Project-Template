import { apiConfig } from "@/api/api.config";
import type { Api } from "@/api/api.gen";
import { apiMock } from "@/api/api.mock";
import { SRV_URL } from "@/Shared/SharedConfig";
import { treaty } from "@elysiajs/eden";

/**
 * @ignore
 * API object for the server interaction
 */
export const api = apiConfig.isMockEnabled ? apiMock : (treaty(SRV_URL).api as unknown as Api);
