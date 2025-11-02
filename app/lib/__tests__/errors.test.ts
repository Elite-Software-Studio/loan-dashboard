import { describe, it, expect } from "vitest";
import {
	AppError,
	ValidationError,
	NotFoundError,
	UnauthorizedError,
	ForbiddenError,
	ConflictError,
	isAppError,
	toAppError,
} from "../errors";

describe("errors", () => {
	describe("AppError", () => {
		it("should create error with default values", () => {
			const error = new AppError("Test error");
			expect(error.message).toBe("Test error");
			expect(error.statusCode).toBe(500);
			expect(error.code).toBe("INTERNAL_ERROR");
			expect(error.isOperational).toBe(true);
		});

		it("should create error with custom values", () => {
			const error = new AppError("Custom error", 400, "CUSTOM_CODE", false);
			expect(error.message).toBe("Custom error");
			expect(error.statusCode).toBe(400);
			expect(error.code).toBe("CUSTOM_CODE");
			expect(error.isOperational).toBe(false);
		});
	});

	describe("ValidationError", () => {
		it("should create validation error", () => {
			const error = new ValidationError("Invalid input", "email");
			expect(error.message).toBe("Invalid input");
			expect(error.statusCode).toBe(400);
			expect(error.code).toBe("VALIDATION_ERROR");
			expect(error.field).toBe("email");
		});
	});

	describe("NotFoundError", () => {
		it("should create not found error with identifier", () => {
			const error = new NotFoundError("User", "123");
			expect(error.message).toBe("User with identifier '123' not found");
			expect(error.statusCode).toBe(404);
		});

		it("should create not found error without identifier", () => {
			const error = new NotFoundError("Resource");
			expect(error.message).toBe("Resource not found");
		});
	});

	describe("UnauthorizedError", () => {
		it("should create unauthorized error", () => {
			const error = new UnauthorizedError();
			expect(error.message).toBe("Unauthorized access");
			expect(error.statusCode).toBe(401);
		});
	});

	describe("ForbiddenError", () => {
		it("should create forbidden error", () => {
			const error = new ForbiddenError();
			expect(error.message).toBe("Access forbidden");
			expect(error.statusCode).toBe(403);
		});
	});

	describe("ConflictError", () => {
		it("should create conflict error", () => {
			const error = new ConflictError();
			expect(error.message).toBe("Resource conflict");
			expect(error.statusCode).toBe(409);
		});
	});

	describe("isAppError", () => {
		it("should identify AppError instances", () => {
			const appError = new AppError("Test");
			const regularError = new Error("Test");

			expect(isAppError(appError)).toBe(true);
			expect(isAppError(regularError)).toBe(false);
		});
	});

	describe("toAppError", () => {
		it("should convert AppError to itself", () => {
			const appError = new AppError("Test");
			expect(toAppError(appError)).toBe(appError);
		});

		it("should convert regular Error to AppError", () => {
			const regularError = new Error("Test error");
			const appError = toAppError(regularError);

			expect(isAppError(appError)).toBe(true);
			expect(appError.message).toBe("Test error");
		});

		it("should convert unknown to AppError", () => {
			const unknown = { some: "value" };
			const appError = toAppError(unknown);

			expect(isAppError(appError)).toBe(true);
			expect(appError.message).toBe("An unknown error occurred");
		});
	});
});
