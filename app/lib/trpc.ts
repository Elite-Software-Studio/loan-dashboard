import { initTRPC } from "@trpc/server";
import { z } from "zod";
import { PrismaClient } from "@prisma/client";

export const prisma = new PrismaClient();

const t = initTRPC.create();

export const router = t.router;
export const publicProcedure = t.procedure;
export const createTRPCRouter = router;
