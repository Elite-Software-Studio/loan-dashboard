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
		const companies = await prisma.company.findMany({
			where: {
				isActive: true,
			},
			include: {
				_count: {
					select: {
						branches: true,
					},
				},
			},
			orderBy: {
				name: "asc",
			},
		});

		return new Response(JSON.stringify(companies), {
			headers: {
				"Content-Type": "application/json",
				"Access-Control-Allow-Origin": "*",
				"Access-Control-Allow-Methods": "GET, POST, OPTIONS",
				"Access-Control-Allow-Headers": "Content-Type",
			},
		});
	} catch (error) {
		console.error("Companies API Error:", error);
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
			const company = await prisma.company.create({
				data: {
					name: data.name,
					code: data.code,
					legalName: data.legalName,
					taxId: data.taxId,
					address: data.address,
					city: data.city,
					state: data.state,
					country: data.country || "USA",
					phone: data.phone,
					email: data.email,
					website: data.website,
				},
			});

			return new Response(JSON.stringify(company), {
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
		console.error("Companies API Error:", error);
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

