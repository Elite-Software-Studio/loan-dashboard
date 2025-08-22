import { initTRPC } from '@trpc/server';
import { z } from 'zod';
import { PrismaClient } from '@prisma/client';

// Initialize Prisma client
export const prisma = new PrismaClient();

// Initialize tRPC
const t = initTRPC.create({
  transformer: {
    input: (value) => value,
    output: (value) => value,
  },
});

// Create router and procedure helpers
export const router = t.router;
export const publicProcedure = t.procedure;

// Middleware for authentication (you can expand this later)
export const createTRPCRouter = router;
