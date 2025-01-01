import { B_PROD } from "@/Shared/bProd.gen";

/** the client environment */
export type ClientEnv = {
	/** the base url */
	BASE_URL: string;
};

/** the client environment variables */
export const clientEnv: ClientEnv = B_PROD
	? {
			BASE_URL: "/Preact-Project-Template/preact_full",
	  }
	: {
			BASE_URL: "",
	  };
