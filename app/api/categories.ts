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
		const categoryId = url.searchParams.get("categoryId");
		const isDefault = url.searchParams.get("isDefault");

		if (categoryId) {
			// Get single category
			const category = await prisma.category.findUnique({
				where: { id: parseInt(categoryId) },
				include: {
					user: true,
				},
			});

			if (!category) {
				return Response.json({ error: "Category not found" }, {
					status: 404,
					headers: CORS_HEADERS,
				});
			}

			return Response.json(category, { headers: CORS_HEADERS });
		}

		// Get categories with filters
		const where: any = {};
		if (userId) {
			where.userId = userId;
		} else {
			// If no userId, get default categories
			where.isDefault = true;
		}
		if (isDefault !== null) {
			where.isDefault = isDefault === "true";
		}

		const categories = await prisma.category.findMany({
			where,
			include: {
				user: true,
			},
			orderBy: {
				name: "asc",
			},
		});

		return Response.json(categories, { headers: CORS_HEADERS });
	} catch (error) {
		console.error("Categories API Error:", error);
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
			// Create new category
			const {
				name,
				icon,
				color,
				isDefault,
				userId,
			} = body;

			if (!name || !icon || !color) {
				return Response.json({ error: "Missing required fields" }, {
					status: 400,
					headers: CORS_HEADERS,
				});
			}

			const category = await prisma.category.create({
				data: {
					name,
					icon,
					color,
					isDefault: isDefault || false,
					userId: userId || null,
				},
				include: {
					user: true,
				},
			});

			return Response.json(category, { headers: CORS_HEADERS });
		}

		if (actionType === "update" || request.method === "PUT") {
			// Update category
			const { id, ...updateData } = body;

			if (!id) {
				return Response.json({ error: "Category ID is required" }, {
					status: 400,
					headers: CORS_HEADERS,
				});
			}

			const category = await prisma.category.update({
				where: { id: parseInt(id) },
				data: updateData,
				include: {
					user: true,
				},
			});

			return Response.json(category, { headers: CORS_HEADERS });
		}

		if (actionType === "delete" || request.method === "DELETE") {
			// Delete category
			const { id } = body;

			if (!id) {
				return Response.json({ error: "Category ID is required" }, {
					status: 400,
					headers: CORS_HEADERS,
				});
			}

			await prisma.category.delete({
				where: { id: parseInt(id) },
			});

			return Response.json({ success: true }, { headers: CORS_HEADERS });
		}

		return Response.json({ error: "Invalid action" }, {
			status: 400,
			headers: CORS_HEADERS,
		});
	} catch (error) {
		console.error("Categories API Error:", error);
		return Response.json({ error: "Internal Server Error" }, {
			status: 500,
			headers: CORS_HEADERS,
		});
	}
}

