import { ApiCaller } from "@/utils/ApiCaller";

export const api = new ApiCaller().get_text<"/api/lorem">().build("https://lorem-api.com");
