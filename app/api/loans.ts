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
		const loanId = url.searchParams.get("loanId");
		const status = url.searchParams.get("status");

		if (loanId) {
			// Get single loan
			const loan = await prisma.loan.findUnique({
				where: { id: loanId },
				include: {
					user: true,
					branch: {
						include: {
							company: true,
						},
					},
				},
			});

			if (!loan) {
				return Response.json({ error: "Loan not found" }, {
					status: 404,
					headers: CORS_HEADERS,
				});
			}

			return Response.json(loan, { headers: CORS_HEADERS });
		}

		// Get loans with filters
		const where: any = {};
		if (userId) {
			where.userId = userId;
		}
		if (status) {
			where.status = status;
		}

		const loans = await prisma.loan.findMany({
			where,
			include: {
				user: true,
				branch: {
					include: {
						company: true,
					},
				},
			},
			orderBy: {
				createdAt: "desc",
			},
		});

		return Response.json(loans, { headers: CORS_HEADERS });
	} catch (error) {
		console.error("Loans API Error:", error);
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
			// Create new loan
			const {
				userId,
				branchId,
				type,
				amount,
				rate,
				startDate,
				endDate,
				description,
			} = body;

			if (!userId || !branchId || !type || !amount || !rate) {
				return Response.json({ error: "Missing required fields" }, {
					status: 400,
					headers: CORS_HEADERS,
				});
			}

			// Generate loan number
			const loanNumber = `LOAN${Date.now()}${Math.floor(Math.random() * 1000)}`;

			const loan = await prisma.loan.create({
				data: {
					loanNumber,
					userId,
					branchId,
					type,
					amount: parseFloat(amount),
					rate: parseFloat(rate),
					startDate: startDate ? new Date(startDate) : new Date(),
					endDate: endDate ? new Date(endDate) : null,
					description: description || null,
					status: "PENDING",
				},
				include: {
					user: true,
					branch: {
						include: {
							company: true,
						},
					},
				},
			});

			return Response.json(loan, { headers: CORS_HEADERS });
		}

		if (actionType === "update" || request.method === "PUT") {
			// Update loan
			const { id, ...updateData } = body;

			if (!id) {
				return Response.json({ error: "Loan ID is required" }, {
					status: 400,
					headers: CORS_HEADERS,
				});
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
			if (updateData.rate) {
				updateData.rate = parseFloat(updateData.rate);
			}

			const loan = await prisma.loan.update({
				where: { id },
				data: updateData,
				include: {
					user: true,
					branch: {
						include: {
							company: true,
						},
					},
				},
			});

			return Response.json(loan, { headers: CORS_HEADERS });
		}

		if (actionType === "delete" || request.method === "DELETE") {
			// Delete loan
			const { id } = body;

			if (!id) {
				return Response.json({ error: "Loan ID is required" }, {
					status: 400,
					headers: CORS_HEADERS,
				});
			}

			await prisma.loan.delete({
				where: { id },
			});

			return Response.json({ success: true }, { headers: CORS_HEADERS });
		}

		return Response.json({ error: "Invalid action" }, {
			status: 400,
			headers: CORS_HEADERS,
		});
	} catch (error) {
		console.error("Loans API Error:", error);
		return Response.json({ error: "Internal Server Error" }, {
			status: 500,
			headers: CORS_HEADERS,
		});
	}
}

