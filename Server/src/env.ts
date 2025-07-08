export const DATABASE_URL = "srv.db";
export const JWT_SECRET = "ec1c656379c5b52bf9ce62737fbf49c9ec54a3c1abce9a7b7af72a140ecd31e7";

declare global {
	namespace NodeJS {
		interface ProcessEnv {
			USER_NAME: string;
			USER_EMAIL: string;
			GOOGLE_CLIENT_ID: string;
			GOOGLE_CLIENT_SECRET: string;
			GOOGLE_REFRESH_TOKEN: string;
		}
	}
}
