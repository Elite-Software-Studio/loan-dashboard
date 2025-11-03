import { prisma } from "../lib/prisma";

export async function loader() {
	try {
		const users = await prisma.user.findMany({
			include: {
				loans: true,
			},
			orderBy: {
				createdAt: "desc",
			},
		});

		return new Response(JSON.stringify(users), {
			headers: {
				"Content-Type": "application/json",
				"Access-Control-Allow-Origin": "*",
				"Access-Control-Allow-Methods": "GET, POST, OPTIONS",
				"Access-Control-Allow-Headers": "Content-Type",
			},
		});
	} catch (error) {
		console.error("Users API Error:", error);
		return new Response(JSON.stringify({ error: "Internal Server Error" }), {
			status: 500,
			headers: {
				"Content-Type": "application/json",
			},
		});
	}
}

// Resource route - loader handles all requests
// Minimal component export for React Router to recognize this as a resource route
export default function UsersResource() {
	return null;
}
