/**
 * Custom error classes for better error handling and debugging
 */

/**
 * Base application error class
 */
export class AppError extends Error {
	public readonly statusCode: number;
	public readonly code: string;
	public readonly isOperational: boolean;

	constructor(
		message: string,
		statusCode: number = 500,
		code: string = "INTERNAL_ERROR",
		isOperational: boolean = true
	) {
		super(message);
		this.name = this.constructor.name;
		this.statusCode = statusCode;
		this.code = code;
		this.isOperational = isOperational;

		Error.captureStackTrace(this, this.constructor);
	}
}

/**
 * Validation error - for input validation failures
 */
export class ValidationError extends AppError {
	constructor(message: string, public readonly field?: string) {
		super(message, 400, "VALIDATION_ERROR", true);
	}
}

/**
 * Not found error - for resource not found scenarios
 */
export class NotFoundError extends AppError {
	constructor(resource: string, identifier?: string) {
		const message = identifier
			? `${resource} with identifier '${identifier}' not found`
			: `${resource} not found`;
		super(message, 404, "NOT_FOUND", true);
	}
}

/**
 * Unauthorized error - for authentication/authorization failures
 */
export class UnauthorizedError extends AppError {
	constructor(message: string = "Unauthorized access") {
		super(message, 401, "UNAUTHORIZED", true);
	}
}

/**
 * Forbidden error - for permission denied scenarios
 */
export class ForbiddenError extends AppError {
	constructor(message: string = "Access forbidden") {
		super(message, 403, "FORBIDDEN", true);
	}
}

/**
 * Conflict error - for resource conflict scenarios (e.g., duplicate entries)
 */
export class ConflictError extends AppError {
	constructor(message: string = "Resource conflict") {
		super(message, 409, "CONFLICT", true);
	}
}

/**
 * Database error wrapper
 */
export class DatabaseError extends AppError {
	constructor(message: string, public readonly originalError?: unknown) {
		super(message, 500, "DATABASE_ERROR", false);
	}
}

/**
 * Type guard to check if error is an AppError
 */
export function isAppError(error: unknown): error is AppError {
	return error instanceof AppError;
}

/**
 * Convert unknown error to AppError
 */
export function toAppError(error: unknown): AppError {
	if (isAppError(error)) {
		return error;
	}

	if (error instanceof Error) {
		return new AppError(error.message, 500, "UNKNOWN_ERROR", false);
	}

	return new AppError("An unknown error occurred", 500, "UNKNOWN_ERROR", false);
}
