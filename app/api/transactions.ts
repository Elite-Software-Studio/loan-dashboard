import { prisma } from "../lib/prisma";

const CORS_HEADERS = {
	"Content-Type": "application/json",
	"Access-Control-Allow-Origin": "*",
	"Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
	"Access-Control-Allow-Headers": "Content-Type, Authorization",
};

export async function loader({ request }: { request: Request }) {
	if (request.method === "OPTIONS") {
		return new Response(null, {
			status: 200,
			headers: CORS_HEADERS,
		});
	}

	try {
		const url = new URL(request.url);
		const userId = url.searchParams.get("userId");
		const transactionId = url.searchParams.get("transactionId");
		const categoryId = url.searchParams.get("categoryId");
		const year = url.searchParams.get("year");
		const month = url.searchParams.get("month"); // 0-11

		if (transactionId) {
			// Get single transaction
			const transaction = await prisma.transaction.findUnique({
				where: { id: transactionId },
				include: {
					user: true,
					category: true,
				},
			});

			if (!transaction) {
				return Response.json({ error: "Transaction not found" }, {
					status: 404,
					headers: CORS_HEADERS,
				});
			}

			return Response.json(transaction, { headers: CORS_HEADERS });
		}

		// Get transactions with filters
		const where: any = {};
		if (userId) {
			where.userId = userId;
		}
		if (categoryId) {
			where.categoryId = parseInt(categoryId);
		}
		if (year && month !== null) {
			const startDate = new Date(parseInt(year), parseInt(month), 1);
			const endDate = new Date(parseInt(year), parseInt(month) + 1, 0, 23, 59, 59, 999);
			where.date = {
				gte: startDate,
				lte: endDate,
			};
		}

		const transactions = await prisma.transaction.findMany({
			where,
			include: {
				user: true,
				category: true,
			},
			orderBy: {
				date: "desc",
			},
		});

		return Response.json(transactions, { headers: CORS_HEADERS });
	} catch (error) {
		console.error("Transactions API Error:", error);
		return Response.json({ error: "Internal Server Error" }, {
			status: 500,
			headers: CORS_HEADERS,
		});
	}
}

export async function action({ request }: { request: Request }) {
	if (request.method === "OPTIONS") {
		return new Response(null, {
			status: 200,
			headers: CORS_HEADERS,
		});
	}

	try {
		const body = await request.json();
		const { action: actionType } = body;

		if (actionType === "create" || request.method === "POST") {
			// Create new transaction
			const {
				userId,
				amount,
				categoryId,
				date,
				note,
				paymentMethod,
				location,
				isRecurring,
				recurrenceType,
				recurringEndDate,
			} = body;

			if (!userId || !amount || !categoryId || !date) {
				return Response.json({ error: "Missing required fields" }, {
					status: 400,
					headers: CORS_HEADERS,
				});
			}

			const transaction = await prisma.transaction.create({
				data: {
					userId,
					amount: parseFloat(amount),
					categoryId: parseInt(categoryId),
					date: new Date(date),
					note: note || null,
					paymentMethod: paymentMethod || null,
					location: location || null,
					isRecurring: isRecurring || false,
					recurrenceType: recurrenceType || null,
					recurringEndDate: recurringEndDate ? new Date(recurringEndDate) : null,
				},
				include: {
					user: true,
					category: true,
				},
			});

			// Update monthly summary
			await updateMonthlySummary(userId, new Date(date));

			return Response.json(transaction, { headers: CORS_HEADERS });
		}

		if (actionType === "update" || request.method === "PUT") {
			// Update transaction
			const { id, ...updateData } = body;

			if (!id) {
				return Response.json({ error: "Transaction ID is required" }, {
					status: 400,
					headers: CORS_HEADERS,
				});
			}

			// Convert date strings to Date objects if present
			if (updateData.date) {
				updateData.date = new Date(updateData.date);
			}
			if (updateData.recurringEndDate) {
				updateData.recurringEndDate = new Date(updateData.recurringEndDate);
			}
			if (updateData.amount) {
				updateData.amount = parseFloat(updateData.amount);
			}
			if (updateData.categoryId) {
				updateData.categoryId = parseInt(updateData.categoryId);
			}

			const transaction = await prisma.transaction.update({
				where: { id },
				data: updateData,
				include: {
					user: true,
					category: true,
				},
			});

			// Recalculate monthly summary
			if (updateData.date) {
				await updateMonthlySummary(transaction.userId, new Date(updateData.date));
			}

			return Response.json(transaction, { headers: CORS_HEADERS });
		}

		if (actionType === "delete" || request.method === "DELETE") {
			// Delete transaction
			const { id } = body;

			if (!id) {
				return Response.json({ error: "Transaction ID is required" }, {
					status: 400,
					headers: CORS_HEADERS,
				});
			}

			// Get transaction before deleting to update summary
			const transaction = await prisma.transaction.findUnique({
				where: { id },
			});

			await prisma.transaction.delete({
				where: { id },
			});

			// Recalculate monthly summary
			if (transaction) {
				await updateMonthlySummary(transaction.userId, transaction.date);
			}

			return Response.json({ success: true }, { headers: CORS_HEADERS });
		}

		return Response.json({ error: "Invalid action" }, {
			status: 400,
			headers: CORS_HEADERS,
		});
	} catch (error) {
		console.error("Transactions API Error:", error);
		return Response.json({ error: "Internal Server Error" }, {
			status: 500,
			headers: CORS_HEADERS,
		});
	}
}

// Helper function to update monthly summary
async function updateMonthlySummary(userId: string, date: Date) {
	try {
		const year = date.getFullYear();
		const month = date.getMonth();

		// Get all transactions for this month
		const startDate = new Date(year, month, 1);
		const endDate = new Date(year, month + 1, 0, 23, 59, 59, 999);

		const transactions = await prisma.transaction.findMany({
			where: {
				userId,
				date: {
					gte: startDate,
					lte: endDate,
				},
			},
		});

		// Calculate totals by category
		const categoryTotals: { [key: number]: number } = {};
		let totalSpent = 0;

		transactions.forEach((transaction) => {
			totalSpent += transaction.amount;
			const catId = transaction.categoryId;
			categoryTotals[catId] = (categoryTotals[catId] || 0) + transaction.amount;
		});

		const categoryBreakdown = Object.keys(categoryTotals).map((catId) => ({
			categoryId: parseInt(catId),
			amount: categoryTotals[parseInt(catId)],
		}));

		// Upsert monthly summary
		await prisma.monthlySummary.upsert({
			where: {
				userId_year_month: {
					userId,
					year,
					month,
				},
			},
			update: {
				totalSpent,
				categoryBreakdown: categoryBreakdown as any,
				updatedAt: new Date(),
			},
			create: {
				userId,
				year,
				month,
				totalSpent,
				categoryBreakdown: categoryBreakdown as any,
			},
		});
	} catch (error) {
		console.error("Error updating monthly summary:", error);
	}
}

