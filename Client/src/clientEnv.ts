import { B_PROD } from "@/Shared/bProd.gen";

export type ClientEnv = {
	BASE_URL: string;
};

export const clientEnv: ClientEnv = B_PROD
	? {
			BASE_URL: "/Preact-Project-Template/react_full",
	  }
	: {
			BASE_URL: "",
	  };
