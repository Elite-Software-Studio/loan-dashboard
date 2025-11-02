/**
 * Logging utility for structured logging throughout the application
 */

type LogLevel = "debug" | "info" | "warn" | "error";

interface LogContext {
	[key: string]: unknown;
}

class Logger {
	private isDevelopment = process.env.NODE_ENV === "development";

	private log(level: LogLevel, message: string, context?: LogContext): void {
		const timestamp = new Date().toISOString();
		const logEntry = {
			timestamp,
			level: level.toUpperCase(),
			message,
			...(context && { context }),
		};

		// In production, you might want to send logs to a service like Datadog, Sentry, etc.
		if (this.isDevelopment) {
			// Use appropriate console method based on level
			switch (level) {
				case "debug":
					console.debug("[DEBUG]", logEntry);
					break;
				case "info":
					console.info("[INFO]", logEntry);
					break;
				case "warn":
					console.warn("[WARN]", logEntry);
					break;
				case "error":
					console.error("[ERROR]", logEntry);
					break;
			}
		} else {
			// In production, use structured logging
			console.log(JSON.stringify(logEntry));
		}
	}

	/**
	 * Log debug messages (only in development)
	 */
	debug(message: string, context?: LogContext): void {
		if (this.isDevelopment) {
			this.log("debug", message, context);
		}
	}

	/**
	 * Log informational messages
	 */
	info(message: string, context?: LogContext): void {
		this.log("info", message, context);
	}

	/**
	 * Log warning messages
	 */
	warn(message: string, context?: LogContext): void {
		this.log("warn", message, context);
	}

	/**
	 * Log error messages
	 */
	error(message: string, error?: unknown, context?: LogContext): void {
		const errorContext = {
			...context,
			...(error instanceof Error && {
				error: {
					name: error.name,
					message: error.message,
					stack: error.stack,
				},
			}),
		};

		this.log("error", message, errorContext);
	}
}

/**
 * Singleton logger instance
 */
export const logger = new Logger();

/**
 * Create a scoped logger with default context
 */
export function createScopedLogger(scope: string, defaultContext?: LogContext) {
	return {
		debug: (message: string, context?: LogContext) =>
			logger.debug(`[${scope}] ${message}`, { ...defaultContext, ...context }),
		info: (message: string, context?: LogContext) =>
			logger.info(`[${scope}] ${message}`, { ...defaultContext, ...context }),
		warn: (message: string, context?: LogContext) =>
			logger.warn(`[${scope}] ${message}`, { ...defaultContext, ...context }),
		error: (message: string, error?: unknown, context?: LogContext) =>
			logger.error(`[${scope}] ${message}`, error, { ...defaultContext, ...context }),
	};
}
