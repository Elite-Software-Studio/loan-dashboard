import { appRouter } from "../../lib/router";
import { prisma } from "../../lib/trpc";

// Simple API handler that bypasses React Router
export async function loader({ request }: { request: Request }) {
	const url = new URL(request.url);
	const path = url.pathname.replace("/trpc/", "");

	try {
		// Handle specific tRPC procedures directly
		if (path === "getUsers") {
			const users = await prisma.user.findMany({
				include: {
					loans: true,
				},
				orderBy: {
					createdAt: "desc",
				},
			});

			return new Response(JSON.stringify({ result: { data: users } }), {
				headers: {
					"Content-Type": "application/json",
					"Access-Control-Allow-Origin": "*",
					"Access-Control-Allow-Methods": "GET, POST, OPTIONS",
					"Access-Control-Allow-Headers": "Content-Type",
				},
			});
		}

		if (path === "getLoans") {
			const loans = await prisma.loan.findMany({
				include: {
					user: true,
				},
				orderBy: {
					createdAt: "desc",
				},
			});

			return new Response(JSON.stringify({ result: { data: loans } }), {
				headers: {
					"Content-Type": "application/json",
					"Access-Control-Allow-Origin": "*",
					"Access-Control-Allow-Methods": "GET, POST, OPTIONS",
					"Access-Control-Allow-Headers": "Content-Type",
				},
			});
		}

		// Default response for unknown procedures
		return new Response(JSON.stringify({ error: "Unknown procedure" }), {
			status: 404,
			headers: {
				"Content-Type": "application/json",
			},
		});
	} catch (error) {
		console.error("API Error:", error);
		return new Response(JSON.stringify({ error: "Internal Server Error" }), {
			status: 500,
			headers: {
				"Content-Type": "application/json",
			},
		});
	}
}

// Action function for POST requests
export async function action({ request }: { request: Request }) {
	return loader({ request });
}

// Default export for the component (required by React Router)
export default function TRPCRoute() {
	return null; // This route doesn't render anything
}
