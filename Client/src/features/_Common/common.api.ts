import { api } from "@/api/api";

/**
 * Check if the server is running
 * @returns true if the server is running, false otherwise
 */
export const isServerRunning = () =>
	api.status
		.get()
		.then(() => true)
		.catch(() => false);
