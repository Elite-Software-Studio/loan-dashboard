import { prisma } from "../lib/prisma";

export async function loader({ request }: { request: Request }) {
	// Handle OPTIONS preflight
	if (request.method === "OPTIONS") {
		return new Response(null, {
			status: 200,
			headers: {
				"Content-Type": "application/json",
				"Access-Control-Allow-Origin": "*",
				"Access-Control-Allow-Methods": "GET, POST, OPTIONS",
				"Access-Control-Allow-Headers": "Content-Type",
			},
		});
	}

	try {
		const users = await prisma.user.findMany({
			include: {
				loans: true,
			},
			orderBy: {
				createdAt: "desc",
			},
		});

		// Use Response.json() to ensure proper JSON formatting
		return Response.json(users, {
			headers: {
				"Content-Type": "application/json",
				"Access-Control-Allow-Origin": "*",
				"Access-Control-Allow-Methods": "GET, POST, OPTIONS",
				"Access-Control-Allow-Headers": "Content-Type",
			},
		});
	} catch (error) {
		console.error("Users API Error:", error);
		return Response.json({ error: "Internal Server Error" }, {
			status: 500,
			headers: {
				"Content-Type": "application/json",
			},
		});
	}
}

// Resource route - no default export needed
// React Router v7 recognizes this as a resource route when only loader/action are exported
