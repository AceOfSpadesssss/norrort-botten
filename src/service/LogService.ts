import pino from "pino";

export class LogService {
	private static logger = pino({
		base: undefined,
		transport: {
			target: "pino-pretty",
			options: {
				colorize: false,
				translateTime: "yyyy-mm-dd h:MM:ss TT",
				ignore: "pid,hostname",
			},
		},
	});

	public static getLogger() {
		return this.logger;
	}
}
