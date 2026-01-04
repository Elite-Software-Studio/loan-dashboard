import { prisma } from "../lib/prisma";
import { requireAdmin, authenticateRequest } from "../lib/authMiddleware";

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
		const requestSource = url.searchParams.get("requestSource");
		const startDate = url.searchParams.get("startDate");
		const endDate = url.searchParams.get("endDate");
		const adminView = url.searchParams.get("adminView") === "true";

		// Check if this is an admin request for loan requests
		if (adminView || requestSource === "mobile") {
			const user = await authenticateRequest(request);
			if (!user || user.role !== "ADMIN") {
				return Response.json(
					{ error: "Unauthorized: Admin access required" },
					{
						status: 403,
						headers: CORS_HEADERS,
					}
				);
			}
		}

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
				return Response.json(
					{ error: "Loan not found" },
					{
						status: 404,
						headers: CORS_HEADERS,
					}
				);
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
		if (requestSource) {
			where.requestSource = requestSource;
		}
		if (startDate || endDate) {
			where.createdAt = {};
			if (startDate) {
				where.createdAt.gte = new Date(startDate);
			}
			if (endDate) {
				where.createdAt.lte = new Date(endDate);
			}
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

		// Check for specific actions first (before falling back to create)
		if (actionType === "approve") {
			// Approve loan (admin only)
			const admin = await requireAdmin(request);
			const { loanId } = body;

			if (!loanId) {
				return Response.json(
					{ error: "Loan ID is required" },
					{
						status: 400,
						headers: CORS_HEADERS,
					}
				);
			}

			// Fetch current loan to validate status
			const currentLoan = await prisma.loan.findUnique({
				where: { id: loanId },
			});

			if (!currentLoan) {
				return Response.json(
					{ error: "Loan not found" },
					{
						status: 404,
						headers: CORS_HEADERS,
					}
				);
			}

			// Business rule: Only PENDING or NEEDS_MORE_INFO loans can be approved
			if (currentLoan.status !== "PENDING" && currentLoan.status !== "NEEDS_MORE_INFO") {
				return Response.json(
					{
						error: `Cannot approve loan. Current status is ${currentLoan.status}. Only PENDING or NEEDS_MORE_INFO loans can be approved.`,
					},
					{
						status: 400,
						headers: CORS_HEADERS,
					}
				);
			}

			const loan = await prisma.loan.update({
				where: { id: loanId },
				data: {
					status: "APPROVED",
					reviewedAt: new Date(),
					reviewedBy: admin.id,
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

		if (actionType === "requestMoreInfo") {
			// Mark loan as needs more info (admin only)
			const admin = await requireAdmin(request);
			const { loanId, adminNotes } = body;

			console.log("[LOANS] RequestMoreInfo - Received:", {
				loanId,
				adminNotes: adminNotes?.substring(0, 50),
				adminNotesLength: adminNotes?.length,
			});

			if (!loanId) {
				return Response.json(
					{ error: "Loan ID is required" },
					{
						status: 400,
						headers: CORS_HEADERS,
					}
				);
			}

			if (!adminNotes || typeof adminNotes !== "string" || adminNotes.trim() === "") {
				return Response.json(
					{ error: "Admin notes are required when requesting more information" },
					{
						status: 400,
						headers: CORS_HEADERS,
					}
				);
			}

			// Fetch current loan to validate status
			const currentLoan = await prisma.loan.findUnique({
				where: { id: loanId },
			});

			if (!currentLoan) {
				return Response.json(
					{ error: "Loan not found" },
					{
						status: 404,
						headers: CORS_HEADERS,
					}
				);
			}

			// Business rule: Only PENDING loans can be marked as needs more info
			if (currentLoan.status !== "PENDING") {
				return Response.json(
					{
						error: `Cannot request more information. Current status is ${currentLoan.status}. Only PENDING loans can be updated.`,
					},
					{
						status: 400,
						headers: CORS_HEADERS,
					}
				);
			}

			const loan = await prisma.loan.update({
				where: { id: loanId },
				data: {
					status: "NEEDS_MORE_INFO",
					adminNotes: adminNotes.trim(),
					reviewedAt: new Date(),
					reviewedBy: admin.id,
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

		if (actionType === "reject") {
			// Reject loan (admin only)
			const admin = await requireAdmin(request);
			const { loanId, adminNotes } = body;

			console.log("[LOANS] Reject - Received:", {
				loanId,
				adminNotes: adminNotes?.substring(0, 50),
				adminNotesLength: adminNotes?.length,
			});

			if (!loanId) {
				return Response.json(
					{ error: "Loan ID is required" },
					{
						status: 400,
						headers: CORS_HEADERS,
					}
				);
			}

			// Business rule: Rejection reason is required
			if (!adminNotes || typeof adminNotes !== "string" || adminNotes.trim() === "") {
				return Response.json(
					{ error: "Rejection reason is required" },
					{
						status: 400,
						headers: CORS_HEADERS,
					}
				);
			}

			// Fetch current loan to validate status
			const currentLoan = await prisma.loan.findUnique({
				where: { id: loanId },
			});

			if (!currentLoan) {
				return Response.json(
					{ error: "Loan not found" },
					{
						status: 404,
						headers: CORS_HEADERS,
					}
				);
			}

			// Business rule: Only PENDING or NEEDS_MORE_INFO loans can be rejected
			if (currentLoan.status !== "PENDING" && currentLoan.status !== "NEEDS_MORE_INFO") {
				return Response.json(
					{
						error: `Cannot reject loan. Current status is ${currentLoan.status}. Only PENDING or NEEDS_MORE_INFO loans can be rejected.`,
					},
					{
						status: 400,
						headers: CORS_HEADERS,
					}
				);
			}

			const loan = await prisma.loan.update({
				where: { id: loanId },
				data: {
					status: "REJECTED",
					adminNotes: adminNotes.trim(),
					reviewedAt: new Date(),
					reviewedBy: admin.id,
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
				return Response.json(
					{ error: "Loan ID is required" },
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
				return Response.json(
					{ error: "Loan ID is required" },
					{
						status: 400,
						headers: CORS_HEADERS,
					}
				);
			}

			await prisma.loan.delete({
				where: { id },
			});

			return Response.json({ success: true }, { headers: CORS_HEADERS });
		}

		// Create new loan (default for POST requests without specific action)
		if (actionType === "create" || (!actionType && request.method === "POST")) {
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
				requestSource,
			} = body;

			if (!userId || !branchId || !type || !amount || !rate) {
				return Response.json(
					{ error: "Missing required fields" },
					{
						status: 400,
						headers: CORS_HEADERS,
					}
				);
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
					requestSource: requestSource || "web",
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

		return Response.json(
			{ error: "Invalid action" },
			{
				status: 400,
				headers: CORS_HEADERS,
			}
		);
	} catch (error) {
		console.error("Loans API Error:", error);
		return Response.json(
			{ error: "Internal Server Error" },
			{
				status: 500,
				headers: CORS_HEADERS,
			}
		);
	}
}
