import { z } from "zod";
import { createTRPCRouter, publicProcedure, prisma } from "./trpc";

export const appRouter = createTRPCRouter({
	// User procedures
	getUsers: publicProcedure.query(async () => {
		return await prisma.user.findMany({
			include: {
				loans: true,
			},
			orderBy: {
				createdAt: "desc",
			},
		});
	}),

	getUser: publicProcedure.input(z.object({ id: z.string() })).query(async ({ input }) => {
		return await prisma.user.findUnique({
			where: { id: input.id },
			include: {
				loans: true,
				payments: true,
				documents: true,
				dependents: true,
				collaterals: true,
			},
		});
	}),

	getUserLoans: publicProcedure.input(z.object({ userId: z.string() })).query(async ({ input }) => {
		return await prisma.loan.findMany({
			where: { userId: input.userId },
			include: {
				user: true,
			},
			orderBy: {
				startDate: "desc",
			},
		});
	}),

	createUser: publicProcedure
		.input(
			z.object({
				email: z.string().email(),
				name: z.string().min(1),
				role: z.enum(["ADMIN", "USER", "MANAGER"]).optional(),
				accountNumber: z.string(),
				creditScore: z.number().optional(),
				internalRiskScore: z.number().optional(),
				maxRiskScore: z.number().optional(),
				averageRate: z.number().optional(),
				memberType: z.enum(["REGULAR", "ELITE", "PREMIUM", "VIP"]).optional(),
			})
		)
		.mutation(async ({ input }) => {
			return await prisma.user.create({
				data: input,
			});
		}),

	// Loan procedures
	getLoans: publicProcedure.query(async () => {
		return await prisma.loan.findMany({
			include: {
				user: true,
			},
			orderBy: {
				createdAt: "desc",
			},
		});
	}),

	createLoan: publicProcedure
		.input(
			z.object({
				loanNumber: z.string(),
				type: z.enum(["HOME_LOAN", "CAR_LOAN", "BUSINESS_LOAN", "PERSONAL_LOAN", "EDUCATION_LOAN"]),
				amount: z.number().positive(),
				rate: z.number().positive(),
				userId: z.string(),
				status: z.enum(["PENDING", "APPROVED", "REJECTED", "ACTIVE", "PAID", "DEFAULTED"]).optional(),
				startDate: z.date(),
				description: z.string().optional(),
			})
		)
		.mutation(async ({ input }) => {
			return await prisma.loan.create({
				data: input,
				include: {
					user: true,
				},
			});
		}),

	updateLoanStatus: publicProcedure
		.input(
			z.object({
				id: z.string(),
				status: z.enum(["PENDING", "APPROVED", "REJECTED", "ACTIVE", "PAID", "DEFAULTED"]),
			})
		)
		.mutation(async ({ input }) => {
			return await prisma.loan.update({
				where: { id: input.id },
				data: { status: input.status },
				include: {
					user: true,
				},
			});
		}),

	// Payment procedures
	getPayments: publicProcedure.query(async () => {
		return await prisma.payment.findMany({
			include: {
				user: true,
			},
			orderBy: {
				date: "desc",
			},
		});
	}),

	createPayment: publicProcedure
		.input(
			z.object({
				amount: z.number().positive(),
				date: z.date(),
				type: z.enum(["EMI", "LUMP_SUM", "PARTIAL"]),
				userId: z.string(),
			})
		)
		.mutation(async ({ input }) => {
			return await prisma.payment.create({
				data: input,
				include: {
					user: true,
				},
			});
		}),

	// Document procedures
	getDocuments: publicProcedure.query(async () => {
		return await prisma.document.findMany({
			include: {
				user: true,
			},
			orderBy: {
				createdAt: "desc",
			},
		});
	}),

	// Dashboard statistics
	getDashboardStats: publicProcedure.query(async () => {
		const [totalUsers, totalLoans, totalAmount, activeLoans] = await Promise.all([
			prisma.user.count(),
			prisma.loan.count(),
			prisma.loan.aggregate({
				_sum: { amount: true },
			}),
			prisma.loan.count({
				where: { status: "ACTIVE" },
			}),
		]);

		return {
			totalUsers,
			totalLoans,
			totalAmount: totalAmount._sum.amount || 0,
			activeLoans,
		};
	}),
});

export type AppRouter = typeof appRouter;
