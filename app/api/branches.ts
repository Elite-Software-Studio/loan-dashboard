import { prisma } from "../lib/prisma";

export async function loader({ request }: { request: Request }) {
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
		const url = new URL(request.url);
		const companyId = url.searchParams.get("companyId");

		const branches = await prisma.branch.findMany({
			where: {
				isActive: true,
				...(companyId ? { companyId } : {}),
			},
			include: {
				company: true,
			},
			orderBy: {
				name: "asc",
			},
		});

		return new Response(JSON.stringify(branches), {
			headers: {
				"Content-Type": "application/json",
				"Access-Control-Allow-Origin": "*",
				"Access-Control-Allow-Methods": "GET, POST, OPTIONS",
				"Access-Control-Allow-Headers": "Content-Type",
			},
		});
	} catch (error) {
		console.error("Branches API Error:", error);
		return new Response(JSON.stringify({ error: "Internal Server Error" }), {
			status: 500,
			headers: {
				"Content-Type": "application/json",
			},
		});
	}
}

export async function action({ request }: { request: Request }) {
	if (request.method === "OPTIONS") {
		return new Response(null, {
			status: 200,
			headers: {
				"Content-Type": "application/json",
				"Access-Control-Allow-Origin": "*",
				"Access-Control-Allow-Methods": "POST, OPTIONS",
				"Access-Control-Allow-Headers": "Content-Type",
			},
		});
	}

	try {
		const data = await request.json();
		
		if (data.action === "create") {
			const branch = await prisma.branch.create({
				data: {
					name: data.name,
					code: data.code,
					companyId: data.companyId,
					address: data.address,
					city: data.city,
					state: data.state,
					country: data.country || "USA",
					phone: data.phone,
					email: data.email,
				},
				include: {
					company: true,
				},
			});

			return new Response(JSON.stringify(branch), {
				status: 201,
				headers: {
					"Content-Type": "application/json",
					"Access-Control-Allow-Origin": "*",
				},
			});
		}

		return new Response(JSON.stringify({ error: "Invalid action" }), {
			status: 400,
			headers: {
				"Content-Type": "application/json",
			},
		});
	} catch (error: any) {
		console.error("Branches API Error:", error);
		return new Response(JSON.stringify({ error: error.message || "Internal Server Error" }), {
			status: 500,
			headers: {
				"Content-Type": "application/json",
			},
		});
	}
}

// Resource route - no default export needed
// React Router v7 recognizes this as a resource route when only loader/action are exported

