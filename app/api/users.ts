import { prisma } from "../lib/trpc";

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

export default function UsersAPI() {
	return null;
}
