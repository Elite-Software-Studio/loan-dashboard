import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import pg from "pg";

const { Pool } = pg;

/**
 * Prisma Client singleton with Prisma 7 adapter
 * Prevents multiple instances in development with hot reloading
 */
const globalForPrisma = globalThis as unknown as {
	prisma: PrismaClient | undefined;
};

// Create PostgreSQL connection pool
const connectionString = process.env.DATABASE_URL_POSTGRESQL || process.env.DATABASE_URL || "";
const pool = new Pool({ connectionString });
const adapter = new PrismaPg(pool);

export const prisma =
	globalForPrisma.prisma ??
	new PrismaClient({
		adapter,
		log: process.env.NODE_ENV === "development" ? ["query", "error", "warn"] : ["error"],
	});

if (process.env.NODE_ENV !== "production") {
	globalForPrisma.prisma = prisma;
}

