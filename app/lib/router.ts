import { z } from "zod";
import { createTRPCRouter, publicProcedure, branchProcedure, prisma } from "./trpc";
import { getBranchId, canAccessBranch } from "./trpc-context";
import { NotFoundError, ForbiddenError, ConflictError, DatabaseError } from "./errors";
import { logger } from "./logger";
import { DEFAULTS } from "./constants";

/**
 * Main application router
 * Contains all tRPC procedures organized by domain
 */
export const appRouter = createTRPCRouter({
	// ==================== COMPANY MANAGEMENT ====================

	/**
	 * Get all active companies
	 * @returns Array of active companies with branch count
	 */
	getCompanies: publicProcedure.query(async () => {
		return await prisma.company.findMany({
			where: {
				isActive: true,
			},
			include: {
				_count: {
					select: {
						branches: true,
					},
				},
			},
			orderBy: {
				name: "asc",
			},
		});
	}),

	/**
	 * Get a single company by ID
	 * @param input - Object containing company ID
	 * @returns Company with branches and counts
	 * @throws NotFoundError if company doesn't exist
	 */
	getCompany: publicProcedure
		.input(z.object({ id: z.string() }))
		.query(async ({ input }) => {
			const company = await prisma.company.findUnique({
				where: { id: input.id },
				include: {
					branches: {
						where: { isActive: true },
						orderBy: { name: "asc" },
					},
					_count: {
						select: {
							branches: true,
						},
					},
				},
			});

			if (!company) {
				throw new NotFoundError("Company", input.id);
			}

			return company;
		}),

	/**
	 * Create a new company
	 * @param input - Company data
	 * @returns Created company
	 * @throws ConflictError if company code already exists
	 */
	createCompany: publicProcedure
		.input(
			z.object({
				name: z.string().min(1, "Company name is required"),
				code: z.string().min(1, "Company code is required"),
				legalName: z.string().optional(),
				taxId: z.string().optional(),
				address: z.string().optional(),
				city: z.string().optional(),
				state: z.string().optional(),
				country: z.string().default(DEFAULTS.COUNTRY),
				phone: z.string().optional(),
				email: z.string().email("Invalid email format").optional(),
				website: z.string().url("Invalid URL format").optional().or(z.literal("")),
			})
		)
		.mutation(async ({ input }) => {
			try {
				return await prisma.company.create({
					data: input,
				});
			} catch (error) {
				logger.error("Failed to create company", error, { code: input.code });
				// Check if it's a unique constraint violation
				if (
					error instanceof Error &&
					error.message.includes("Unique constraint")
				) {
					throw new ConflictError(`Company with code '${input.code}' already exists`);
				}
				throw new DatabaseError("Failed to create company", error);
			}
		}),

	updateCompany: publicProcedure
		.input(
			z.object({
				id: z.string(),
				name: z.string().optional(),
				code: z.string().optional(),
				legalName: z.string().optional(),
				taxId: z.string().optional(),
				address: z.string().optional(),
				city: z.string().optional(),
				state: z.string().optional(),
				country: z.string().optional(),
				phone: z.string().optional(),
				email: z.string().email().optional(),
				website: z.string().url().optional().or(z.literal("")),
				isActive: z.boolean().optional(),
			})
		)
		.mutation(async ({ input }) => {
			const { id, ...data } = input;
			return await prisma.company.update({
				where: { id },
				data,
			});
		}),

	// ==================== BRANCH MANAGEMENT ====================
	
	getBranches: publicProcedure
		.input(
			z.object({
				companyId: z.string().optional(),
			}).optional()
		)
		.query(async ({ input }) => {
			return await prisma.branch.findMany({
				where: {
					isActive: true,
					...(input?.companyId ? { companyId: input.companyId } : {}),
				},
				include: {
					company: true,
				},
				orderBy: {
					name: "asc",
				},
			});
		}),

	getBranch: publicProcedure
		.input(z.object({ id: z.string() }))
		.query(async ({ input }) => {
			return await prisma.branch.findUnique({
				where: { id: input.id },
				include: {
					_count: {
						select: {
							users: true,
							loans: true,
						},
					},
				},
			});
		}),

	createBranch: publicProcedure
		.input(
			z.object({
				code: z.string().min(1),
				name: z.string().min(1),
				companyId: z.string().min(1), // Required: branch must belong to a company
				address: z.string().optional(),
				city: z.string().optional(),
				state: z.string().optional(),
				country: z.string().default("USA"),
				phone: z.string().optional(),
				email: z.string().email().optional(),
			})
		)
		.mutation(async ({ input }) => {
			return await prisma.branch.create({
				data: input,
				include: {
					company: true,
				},
			});
		}),

	updateBranch: publicProcedure
		.input(
			z.object({
				id: z.string(),
				code: z.string().optional(),
				name: z.string().optional(),
				companyId: z.string().optional(),
				address: z.string().optional(),
				city: z.string().optional(),
				state: z.string().optional(),
				country: z.string().optional(),
				phone: z.string().optional(),
				email: z.string().email().optional(),
				isActive: z.boolean().optional(),
			})
		)
		.mutation(async ({ input }) => {
			const { id, ...data } = input;
			return await prisma.branch.update({
				where: { id },
				data,
				include: {
					company: true,
				},
			});
		}),

	// ==================== USER PROCEDURES (Branch-aware) ====================

	getUsers: branchProcedure
		.input(
			z.object({
				branchId: z.string().optional(), // Optional: filter by specific branch
			}).optional()
		)
		.query(async ({ ctx, input }) => {
			const branchId = getBranchId(ctx, input?.branchId);
			
			return await prisma.user.findMany({
				where: branchId ? { branchId } : undefined,
				include: {
					loans: true,
					branch: true,
				},
				orderBy: {
					createdAt: "desc",
				},
			});
		}),

	getUser: publicProcedure
		.input(z.object({ id: z.string() }))
		.query(async ({ input }) => {
			return await prisma.user.findUnique({
				where: { id: input.id },
				include: {
					loans: true,
					payments: true,
					documents: true,
					dependents: true,
					collaterals: true,
					branch: true,
				},
			});
		}),

	getUserLoans: branchProcedure
		.input(
			z.object({
				userId: z.string(),
				branchId: z.string().optional(),
			})
		)
		.query(async ({ ctx, input }) => {
			const branchId = getBranchId(ctx, input.branchId);
			
			return await prisma.loan.findMany({
				where: {
					userId: input.userId,
					...(branchId ? { branchId } : {}),
				},
				include: {
					user: true,
					branch: true,
				},
				orderBy: {
					startDate: "desc",
				},
			});
		}),

	createUser: branchProcedure
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
				branchId: z.string().optional(), // Optional: will use context branchId if not provided
			})
		)
		.mutation(async ({ ctx, input }) => {
			const branchId = getBranchId(ctx, input.branchId);
			
			return await prisma.user.create({
				data: {
					...input,
					branchId: branchId || null, // null for super admin
				},
				include: {
					branch: true,
				},
			});
		}),

	// ==================== LOAN PROCEDURES (Branch-aware) ====================

	getLoans: branchProcedure
		.input(
			z.object({
				branchId: z.string().optional(),
			}).optional()
		)
		.query(async ({ ctx, input }) => {
			const branchId = getBranchId(ctx, input?.branchId);
			
			return await prisma.loan.findMany({
				where: branchId ? { branchId } : undefined,
				include: {
					user: true,
					branch: true,
				},
				orderBy: {
					createdAt: "desc",
				},
			});
		}),

	/**
	 * Create a new loan
	 * @param input - Loan data including user, type, amount, rate, etc.
	 * @returns Created loan with user and branch information
	 * @throws ValidationError if branch ID cannot be determined
	 * @throws NotFoundError if user doesn't exist
	 */
	createLoan: branchProcedure
		.input(
			z.object({
				loanNumber: z.string().min(1, "Loan number is required"),
				type: z.enum(["HOME_LOAN", "CAR_LOAN", "BUSINESS_LOAN", "PERSONAL_LOAN", "EDUCATION_LOAN"]),
				amount: z.number().positive("Loan amount must be positive"),
				rate: z.number().positive("Interest rate must be positive"),
				userId: z.string().min(1, "User ID is required"),
				status: z.enum(["PENDING", "APPROVED", "REJECTED", "ACTIVE", "PAID", "DEFAULTED"]).optional(),
				startDate: z.date(),
				description: z.string().optional(),
				branchId: z.string().optional(), // Optional: will use context branchId or user's branch
			})
		)
		.mutation(async ({ ctx, input }) => {
			// Get branchId from input, context, or user's branch
			let branchId = getBranchId(ctx, input.branchId);

			// If no branchId provided, get from user
			if (!branchId) {
				const user = await prisma.user.findUnique({
					where: { id: input.userId },
					select: { branchId: true },
				});

				if (!user) {
					throw new NotFoundError("User", input.userId);
				}

				branchId = user.branchId || undefined;
			}

			if (!branchId) {
				throw new Error("Branch ID is required to create a loan");
			}

			try {
				return await prisma.loan.create({
					data: {
						...input,
						branchId,
					},
					include: {
						user: true,
						branch: true,
					},
				});
			} catch (error) {
				logger.error("Failed to create loan", error, { loanNumber: input.loanNumber, userId: input.userId });
				if (error instanceof Error && error.message.includes("Unique constraint")) {
					throw new ConflictError(`Loan with number '${input.loanNumber}' already exists`);
				}
				throw new DatabaseError("Failed to create loan", error);
			}
		}),

	/**
	 * Update loan status
	 * @param input - Loan ID, new status, and optional branchId for authorization
	 * @returns Updated loan with user and branch information
	 * @throws NotFoundError if loan doesn't exist
	 * @throws ForbiddenError if user doesn't have access to the loan's branch
	 */
	updateLoanStatus: branchProcedure
		.input(
			z.object({
				id: z.string(),
				status: z.enum(["PENDING", "APPROVED", "REJECTED", "ACTIVE", "PAID", "DEFAULTED"]),
				branchId: z.string().optional(), // For authorization check
			})
		)
		.mutation(async ({ ctx, input }) => {
			const branchId = getBranchId(ctx, input.branchId);

			// Check if loan exists and belongs to branch (if branchId is set)
			const loan = await prisma.loan.findUnique({
				where: { id: input.id },
				select: { branchId: true },
			});

			if (!loan) {
				throw new NotFoundError("Loan", input.id);
			}

			if (branchId && loan.branchId !== branchId) {
				throw new ForbiddenError("Loan does not belong to your branch");
			}

			return await prisma.loan.update({
				where: { id: input.id },
				data: { status: input.status },
				include: {
					user: true,
					branch: true,
				},
			});
		}),

	// ==================== PAYMENT PROCEDURES (Branch-aware) ====================

	getPayments: branchProcedure
		.input(
			z.object({
				branchId: z.string().optional(),
			}).optional()
		)
		.query(async ({ ctx, input }) => {
			const branchId = getBranchId(ctx, input?.branchId);
			
			return await prisma.payment.findMany({
				where: branchId ? { branchId } : undefined,
				include: {
					user: true,
					branch: true,
				},
				orderBy: {
					date: "desc",
				},
			});
		}),

	createPayment: branchProcedure
		.input(
			z.object({
				amount: z.number().positive(),
				date: z.date(),
				type: z.enum(["EMI", "LUMP_SUM", "PARTIAL"]),
				userId: z.string(),
				branchId: z.string().optional(), // Optional: will use context or user's branch
			})
		)
		.mutation(async ({ ctx, input }) => {
			// Get branchId from input, context, or user's branch
			let branchId = getBranchId(ctx, input.branchId);

			// If no branchId provided, get from user (and verify user exists)
			if (!branchId) {
				const user = await prisma.user.findUnique({
					where: { id: input.userId },
					select: { branchId: true, id: true },
				});

				if (!user) {
					throw new NotFoundError("User", input.userId);
				}

				branchId = user.branchId || undefined;
			}

			if (!branchId) {
				throw new Error("Branch ID is required to create a payment");
			}

			try {
				return await prisma.payment.create({
				data: {
					amount: input.amount,
					date: input.date,
					type: input.type,
					userId: input.userId,
					branchId,
				},
					include: {
						user: true,
						branch: true,
					},
				});
			} catch (error) {
				logger.error("Failed to create payment", error, { userId: input.userId, branchId });
				throw new DatabaseError("Failed to create payment", error);
			}
		}),

	// ==================== DOCUMENT PROCEDURES (Branch-aware) ====================

	getDocuments: branchProcedure
		.input(
			z.object({
				branchId: z.string().optional(),
			}).optional()
		)
		.query(async ({ ctx, input }) => {
			const branchId = getBranchId(ctx, input?.branchId);
			
			return await prisma.document.findMany({
				where: branchId ? { branchId } : undefined,
				include: {
					user: true,
					branch: true,
				},
				orderBy: {
					createdAt: "desc",
				},
			});
		}),

	// ==================== DASHBOARD STATISTICS (Branch-aware) ====================

	getDashboardStats: branchProcedure
		.input(
			z.object({
				branchId: z.string().optional(),
			}).optional()
		)
		.query(async ({ ctx, input }) => {
			const branchId = getBranchId(ctx, input?.branchId);
			const whereClause = branchId ? { branchId } : {};
			
			const [totalUsers, totalLoans, totalAmount, activeLoans] = await Promise.all([
				prisma.user.count({
					where: branchId ? { branchId } : undefined,
				}),
				prisma.loan.count({
					where: whereClause,
				}),
				prisma.loan.aggregate({
					where: whereClause,
					_sum: { amount: true },
				}),
				prisma.loan.count({
					where: {
						...whereClause,
						status: "ACTIVE",
					},
				}),
			]);

			return {
				totalUsers,
				totalLoans,
				totalAmount: totalAmount._sum.amount || 0,
				activeLoans,
				branchId: branchId || null,
			};
		}),
});

export type AppRouter = typeof appRouter;
