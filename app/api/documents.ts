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
		const documentId = url.searchParams.get("documentId");

		if (documentId) {
			// Get single document
			const document = await prisma.document.findUnique({
				where: { id: documentId },
				include: {
					user: true,
					branch: {
						include: {
							company: true,
						},
					},
				},
			});

			if (!document) {
				return Response.json({ error: "Document not found" }, {
					status: 404,
					headers: CORS_HEADERS,
				});
			}

			return Response.json(document, { headers: CORS_HEADERS });
		}

		// Get documents with filters
		const where: any = {};
		if (userId) {
			where.userId = userId;
		}

		const documents = await prisma.document.findMany({
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

		return Response.json(documents, { headers: CORS_HEADERS });
	} catch (error) {
		console.error("Documents API Error:", error);
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
			// Create new document
			const {
				userId,
				branchId,
				name,
				type,
				url,
			} = body;

			if (!userId || !branchId || !name || !type || !url) {
				return Response.json({ error: "Missing required fields" }, {
					status: 400,
					headers: CORS_HEADERS,
				});
			}

			const document = await prisma.document.create({
				data: {
					userId,
					branchId,
					name,
					type,
					url,
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

			return Response.json(document, { headers: CORS_HEADERS });
		}

		if (actionType === "update" || request.method === "PUT") {
			// Update document
			const { id, ...updateData } = body;

			if (!id) {
				return Response.json({ error: "Document ID is required" }, {
					status: 400,
					headers: CORS_HEADERS,
				});
			}

			const document = await prisma.document.update({
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

			return Response.json(document, { headers: CORS_HEADERS });
		}

		if (actionType === "delete" || request.method === "DELETE") {
			// Delete document
			const { id } = body;

			if (!id) {
				return Response.json({ error: "Document ID is required" }, {
					status: 400,
					headers: CORS_HEADERS,
				});
			}

			await prisma.document.delete({
				where: { id },
			});

			return Response.json({ success: true }, { headers: CORS_HEADERS });
		}

		return Response.json({ error: "Invalid action" }, {
			status: 400,
			headers: CORS_HEADERS,
		});
	} catch (error) {
		console.error("Documents API Error:", error);
		return Response.json({ error: "Internal Server Error" }, {
			status: 500,
			headers: CORS_HEADERS,
		});
	}
}

