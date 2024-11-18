/* eslint-disable no-mixed-spaces-and-tabs */
import { type Treaty, treaty } from "@elysiajs/eden";
import { SRV_URL } from "../Common/CommonConfig";

type Api = {
	status: {
		get: (
			options?:
				| {
						headers?: Record<string, unknown> | undefined;
						query?: Record<string, unknown> | undefined;
						fetch?: RequestInit | undefined;
				  }
				| undefined
		) => Promise<
			Treaty.TreatyResponse<{
				200: string;
			}>
		>;
	};
};

const api = treaty(SRV_URL).api as Api;

/**
 * Check if the server is running
 * @returns true if the server is running, false otherwise
 */
export const isServerRunning = () =>
	api.status
		.get()
		.then(() => true)
		.catch(() => false);
