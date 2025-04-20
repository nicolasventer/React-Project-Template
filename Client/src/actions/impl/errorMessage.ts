import { setAppWithUpdate } from "@/globalState";

const clearErrorMessage = () => setAppWithUpdate("clearErrorMessage", (prev) => (prev.errorMessage = null));

export const errorMessage = {
	clear: clearErrorMessage,
};
