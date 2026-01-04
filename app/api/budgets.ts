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
		const budgetId = url.searchParams.get("budgetId");
		const period = url.searchParams.get("period");
		const categoryId = url.searchParams.get("categoryId");

		if (budgetId) {
			// Get single budget
			const budget = await prisma.budget.findUnique({
				where: { id: budgetId },
				include: {
					user: true,
					category: true,
				},
			});

			if (!budget) {
				return Response.json(
					{ error: "Budget not found" },
					{
						status: 404,
						headers: CORS_HEADERS,
					}
				);
			}

			return Response.json(budget, { headers: CORS_HEADERS });
		}

		// Get budgets with filters
		const where: any = {};
		if (userId) {
			where.userId = userId;
		}
		if (period) {
			where.period = period;
		}
		if (categoryId) {
			where.categoryId = parseInt(categoryId);
		}

		const budgets = await prisma.budget.findMany({
			where,
			include: {
				user: true,
				category: true,
			},
			orderBy: {
				createdAt: "desc",
			},
		});

		return Response.json(budgets, { headers: CORS_HEADERS });
	} catch (error) {
		console.error("Budgets API Error:", error);
		return Response.json(
			{ error: "Internal Server Error" },
			{
				status: 500,
				headers: CORS_HEADERS,
			}
		);
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
			// Create or update budget
			const { userId, categoryId, amount, period, startDate, endDate } = body;

			if (!userId || !amount || !period || !startDate) {
				return Response.json(
					{ error: "Missing required fields" },
					{
						status: 400,
						headers: CORS_HEADERS,
					}
				);
			}

			// Check if budget already exists
			const existingBudget = await prisma.budget.findFirst({
				where: {
					userId,
					categoryId: categoryId ? parseInt(categoryId) : null,
					period,
				},
			});

			let budget;
			if (existingBudget) {
				// Update existing budget
				budget = await prisma.budget.update({
					where: { id: existingBudget.id },
					data: {
						amount: parseFloat(amount),
						startDate: new Date(startDate),
						endDate: endDate ? new Date(endDate) : null,
					},
					include: {
						user: true,
						category: true,
					},
				});
			} else {
				// Create new budget
				budget = await prisma.budget.create({
					data: {
						userId,
						categoryId: categoryId ? parseInt(categoryId) : null,
						amount: parseFloat(amount),
						period,
						startDate: new Date(startDate),
						endDate: endDate ? new Date(endDate) : null,
					},
					include: {
						user: true,
						category: true,
					},
				});
			}

			return Response.json(budget, { headers: CORS_HEADERS });
		}

		if (actionType === "update" || request.method === "PUT") {
			// Update budget
			const { id, ...updateData } = body;

			if (!id) {
				return Response.json(
					{ error: "Budget ID is required" },
					{
						status: 400,
						headers: CORS_HEADERS,
					}
				);
			}

			// Convert date strings to Date objects if present
			if (updateData.startDate) {
				updateData.startDate = new Date(updateData.startDate);
			}
			if (updateData.endDate) {
				updateData.endDate = new Date(updateData.endDate);
			}
			if (updateData.amount) {
				updateData.amount = parseFloat(updateData.amount);
			}
			if (updateData.categoryId) {
				updateData.categoryId = parseInt(updateData.categoryId);
			}

			const budget = await prisma.budget.update({
				where: { id },
				data: updateData,
				include: {
					user: true,
					category: true,
				},
			});

			return Response.json(budget, { headers: CORS_HEADERS });
		}

		if (actionType === "delete" || request.method === "DELETE") {
			// Delete budget
			const { id } = body;

			if (!id) {
				return Response.json(
					{ error: "Budget ID is required" },
					{
						status: 400,
						headers: CORS_HEADERS,
					}
				);
			}

			await prisma.budget.delete({
				where: { id },
			});

			return Response.json({ success: true }, { headers: CORS_HEADERS });
		}

		return Response.json(
			{ error: "Invalid action" },
			{
				status: 400,
				headers: CORS_HEADERS,
			}
		);
	} catch (error) {
		console.error("Budgets API Error:", error);
		return Response.json(
			{ error: "Internal Server Error" },
			{
				status: 500,
				headers: CORS_HEADERS,
			}
		);
	}
}
