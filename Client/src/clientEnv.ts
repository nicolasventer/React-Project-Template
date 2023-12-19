import { B_PROD } from "./_bProd";

/** the client environment */
export type ClientEnv = {
	/** the base url */
	BASE_URL: string;
};

/** the client environment variables */
export const clientEnv: ClientEnv = B_PROD
	? {
			BASE_URL: "/Preact-Project-Template/preact_full",
			// eslint-disable-next-line no-mixed-spaces-and-tabs
	  }
	: {
			BASE_URL: "",
			// eslint-disable-next-line no-mixed-spaces-and-tabs
	  };
