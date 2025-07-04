import { JwtService } from "@/jwt";
import type { RoleType } from "@/Shared/SharedModel";
import { Elysia } from "elysia";

export const checkRole = new Elysia({ name: "checkRole" }).macro({
	checkRole: (role: RoleType | "*") => ({
		resolve(ctx) {
			const verified = JwtService.getVerifiedLoginToken(ctx);
			if (verified === true) return ctx.status(401, "Token expired");
			if (verified === false) return ctx.status(401, "Invalid token");
			if (role !== "*" && verified.role !== role) return ctx.status(401, `${role} role required`);
			return verified;
		},
	}),
});

type LimitRateType = "user" | "email" | "ip";

const LIMIT_RATE_RESET_TIME_IN_SEC = 60; // 1 minute

const LIMIT_RATE_VALUES: Record<LimitRateType, number> = {
	ip: 1 * LIMIT_RATE_RESET_TIME_IN_SEC,
	email: 10 * LIMIT_RATE_RESET_TIME_IN_SEC,
	user: 100 * LIMIT_RATE_RESET_TIME_IN_SEC,
};

const limitRateMap: Record<LimitRateType | (string & {}), Map<string, number>> = {
	ip: new Map(),
	email: new Map(),
	user: new Map(),
};

setInterval(() => {
	for (const key in limitRateMap) limitRateMap[key].clear();
}, LIMIT_RATE_RESET_TIME_IN_SEC * 1000);

export const limitRate = new Elysia({ name: "limitRate" }).macro({
	limitRate: (limitPerSecond: number) => ({
		resolve(ctx) {
			const pathname = new URL(ctx.request.url).pathname;
			if (!limitRateMap[pathname]) limitRateMap[pathname] = new Map();
			const limitRate = limitRateMap[pathname];
			const key = "global";
			const value = limitRate.get(key) ?? 0;
			if (value > limitPerSecond * LIMIT_RATE_RESET_TIME_IN_SEC) return ctx.status(401, "Limit exceeded");
			limitRate.set(key, value + 1);
			return {};
		},
	}),
});

// careful, plugin not unique
export const rateLimiter = (app: Elysia) =>
	app.resolve((ctx) => {
		const verified = JwtService.getVerifiedLoginToken(ctx);
		if (!ctx.request.url.endsWith("/login") && typeof verified !== "boolean") {
			const userValue = limitRateMap.user.get(verified.userId.toString()) ?? 0;
			if (userValue > LIMIT_RATE_VALUES.user) return ctx.status(401, "Limit exceeded");
			limitRateMap.user.set(verified.userId.toString(), userValue + 1);
		} else {
			const ip = ctx.server?.requestIP(ctx.request)?.address;
			if (ip) {
				const ipValue = limitRateMap.ip.get(ip) ?? 0;
				if (ipValue > LIMIT_RATE_VALUES.ip) return ctx.status(401, "Limit exceeded");
				limitRateMap.ip.set(ip, ipValue + 1);
			}
			const email = (ctx.body as { email: string } | undefined)?.email;
			if (email) {
				const emailValue = limitRateMap.email.get(email) ?? 0;
				if (emailValue > LIMIT_RATE_VALUES.email) return ctx.status(401, "Limit exceeded");
				limitRateMap.email.set(email, emailValue + 1);
			}
		}
	});
