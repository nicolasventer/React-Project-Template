import winston from "winston";
import "winston-daily-rotate-file";

export const initWinston = () => {
	const formatPrintNoColor = [winston.format.printf(({ level, message }) => `${`[${level}]`.padEnd(9)} ${message}`)];
	const formatPrintWithColor = [
		winston.format.timestamp(),
		winston.format.printf(({ timestamp, level, message }) => `${timestamp} ${`[${level}]`.padEnd(9)} ${message}`),
		winston.format.colorize({ all: true }),
	];

	const logger = winston.createLogger({
		level: "debug",
		transports: [
			new winston.transports.Console({
				format: winston.format.combine(winston.format.splat(), winston.format.simple(), ...formatPrintWithColor),
			}),
			new winston.transports.DailyRotateFile({
				level: "debug",
				filename: "logs/mpt-%DATE%.log",
				datePattern: "YYYY-MM-DD",
				maxFiles: "7d",
				format: winston.format.combine(winston.format.splat(), winston.format.simple(), ...formatPrintNoColor),
			}),
		],
	});

	console.debug = logger.debug.bind(logger);
	console.log = logger.debug.bind(logger);
	console.info = logger.info.bind(logger);
	console.warn = logger.warn.bind(logger);
	console.error = logger.error.bind(logger);
};
