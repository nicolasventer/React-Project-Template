import type { CapacitorConfig } from "@capacitor/cli";

const config: CapacitorConfig = {
	appId: "com.example.app",
	appName: "client",
	webDir: "dist",
	loggingBehavior: "debug",
	backgroundColor: "#ff0000",
	server: {
		url: "http://192.168.1.16:5173",
		cleartext: true,
	},
};

export default config;
