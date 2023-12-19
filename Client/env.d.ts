declare namespace NodeJS {
	interface ProcessEnv {
		USE_COVERAGE?: "true";
		USE_HTML?: "true";
		USE_CSR?: "true";
		USE_HTTPS?: "true";
		BASE_URL?: string;
	}
}
