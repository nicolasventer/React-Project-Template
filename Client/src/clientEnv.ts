import { B_PROD } from "@/Shared/bProd.gen";

export type ClientEnv = {
	BASE_URL: string;
};

export const clientEnv: ClientEnv = B_PROD
	? {
			BASE_URL: "/React-Project-Template", // should be /React-Project-Template/full when light version is ready
	  }
	: {
			BASE_URL: "",
	  };
