import { initTRPC, TRPCError } from "@trpc/server";
import { PrismaClient } from "@prisma/client";
import type { Context } from "./trpc-context";
import { logger } from "./logger";
import { toAppError } from "./errors";

/**
 * Prisma Client singleton
 * Prevents multiple instances in development with hot reloading
 */
const globalForPrisma = globalThis as unknown as {
	prisma: PrismaClient | undefined;
};

export const prisma =
	globalForPrisma.prisma ??
	new PrismaClient({
		log: process.env.NODE_ENV === "development" ? ["query", "error", "warn"] : ["error"],
	});

if (process.env.NODE_ENV !== "production") {
	globalForPrisma.prisma = prisma;
}

/**
 * Creates tRPC context from request
 * Extracts user information from session/auth headers/cookies
 *
 * @param req - Optional request object
 * @returns Context object with user information
 */
export function createContext(req?: Request): Context {
	// TODO: Extract from session/auth headers
	// Example:
	// const session = await getSession(req);
	// return {
	//   userId: session?.userId,
	//   branchId: session?.branchId,
	//   role: session?.role,
	// };

	// For now, return empty context - will be populated by middleware or input
	return {};
}

/**
 * Initialize tRPC with context type
 */
const t = initTRPC.context<Context>().create({
	errorFormatter({ shape, error }) {
		const appError = toAppError(error.cause ?? error);
		return {
			...shape,
			data: {
				...shape.data,
				code: appError.code,
				httpStatus: appError.statusCode,
			},
		};
	},
});

/**
 * Base procedures
 */
export const router = t.router;
export const publicProcedure = t.procedure;
export const createTRPCRouter = router;

/**
 * Error handling middleware
 * Wraps procedures to handle errors gracefully
 */
const errorMiddleware = t.middleware(async ({ ctx, next, path }) => {
	try {
		return await next({ ctx });
	} catch (error) {
		const appError = toAppError(error);
		logger.error(`tRPC Error in ${path}`, appError, { path, ctx: { branchId: ctx.branchId } });

		// Re-throw as TRPCError for proper handling
		if (appError.statusCode >= 400 && appError.statusCode < 500) {
			throw new TRPCError({
				code:
					appError.statusCode === 401
						? "UNAUTHORIZED"
						: appError.statusCode === 403
							? "FORBIDDEN"
							: appError.statusCode === 404
								? "NOT_FOUND"
								: "BAD_REQUEST",
				message: appError.message,
				cause: appError,
			});
		}

		throw new TRPCError({
			code: "INTERNAL_SERVER_ERROR",
			message: "An unexpected error occurred",
			cause: appError,
		});
	}
});

/**
 * Branch-aware procedure that filters by branchId
 * Automatically extracts branchId from context and passes it to procedures
 */
export const branchProcedure = publicProcedure.use(errorMiddleware).use(async ({ ctx, next }) => {
	// Extract branchId from context (set by createContext or middleware)
	const branchId = ctx?.branchId;

	// Pass enhanced context to next procedure
	return next({
		ctx: {
			...ctx,
			branchId,
		},
	});
});
