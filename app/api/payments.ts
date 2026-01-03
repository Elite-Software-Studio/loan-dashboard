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
		const paymentId = url.searchParams.get("paymentId");
		const loanId = url.searchParams.get("loanId");

		if (paymentId) {
			// Get single payment
			const payment = await prisma.payment.findUnique({
				where: { id: paymentId },
				include: {
					user: true,
					branch: {
						include: {
							company: true,
						},
					},
				},
			});

			if (!payment) {
				return Response.json({ error: "Payment not found" }, {
					status: 404,
					headers: CORS_HEADERS,
				});
			}

			return Response.json(payment, { headers: CORS_HEADERS });
		}

		// Get payments with filters
		const where: any = {};
		if (userId) {
			where.userId = userId;
		}

		const payments = await prisma.payment.findMany({
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
				date: "desc",
			},
		});

		return Response.json(payments, { headers: CORS_HEADERS });
	} catch (error) {
		console.error("Payments API Error:", error);
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
			// Create new payment
			const {
				userId,
				branchId,
				amount,
				date,
				type,
			} = body;

			if (!userId || !branchId || !amount || !date || !type) {
				return Response.json({ error: "Missing required fields" }, {
					status: 400,
					headers: CORS_HEADERS,
				});
			}

			const payment = await prisma.payment.create({
				data: {
					userId,
					branchId,
					amount: parseFloat(amount),
					date: new Date(date),
					type,
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

			return Response.json(payment, { headers: CORS_HEADERS });
		}

		if (actionType === "update" || request.method === "PUT") {
			// Update payment
			const { id, ...updateData } = body;

			if (!id) {
				return Response.json({ error: "Payment ID is required" }, {
					status: 400,
					headers: CORS_HEADERS,
				});
			}

			// Convert date strings to Date objects if present
			if (updateData.date) {
				updateData.date = new Date(updateData.date);
			}
			if (updateData.amount) {
				updateData.amount = parseFloat(updateData.amount);
			}

			const payment = await prisma.payment.update({
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

			return Response.json(payment, { headers: CORS_HEADERS });
		}

		if (actionType === "delete" || request.method === "DELETE") {
			// Delete payment
			const { id } = body;

			if (!id) {
				return Response.json({ error: "Payment ID is required" }, {
					status: 400,
					headers: CORS_HEADERS,
				});
			}

			await prisma.payment.delete({
				where: { id },
			});

			return Response.json({ success: true }, { headers: CORS_HEADERS });
		}

		return Response.json({ error: "Invalid action" }, {
			status: 400,
			headers: CORS_HEADERS,
		});
	} catch (error) {
		console.error("Payments API Error:", error);
		return Response.json({ error: "Internal Server Error" }, {
			status: 500,
			headers: CORS_HEADERS,
		});
	}
}

