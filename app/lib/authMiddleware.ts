import { prisma } from "./prisma";
import { getUserIdFromRequest } from "./jwt";

/**
 * Middleware to authenticate requests using JWT token
 * Returns the authenticated user or null
 */
export async function authenticateRequest(request: Request) {
	const userId = getUserIdFromRequest(request);
	
	if (!userId) {
		return null;
	}

	try {
		const user = await prisma.user.findUnique({
			where: { id: userId },
			include: {
				branch: {
					include: {
						company: true,
					},
				},
			},
		});

		return user;
	} catch (error) {
		console.error("Error authenticating user:", error);
		return null;
	}
}

/**
 * Require authentication - throws error if user is not authenticated
 */
export async function requireAuth(request: Request) {
	const user = await authenticateRequest(request);
	
	if (!user) {
		throw new Response(
			JSON.stringify({ error: "Unauthorized" }),
			{
				status: 401,
				headers: { "Content-Type": "application/json" },
			}
		);
	}

	return user;
}

/**
 * Require admin role - throws error if user is not admin
 */
export async function requireAdmin(request: Request) {
	const user = await requireAuth(request);
	
	if (user.role !== "ADMIN") {
		throw new Response(
			JSON.stringify({ error: "Forbidden: Admin access required" }),
			{
				status: 403,
				headers: { "Content-Type": "application/json" },
			}
		);
	}

	return user;
}

