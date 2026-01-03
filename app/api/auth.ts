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

		if (userId) {
			// Get user by ID
			const user = await prisma.user.findUnique({
				where: { id: userId },
				include: {
					branch: {
						include: {
							company: true,
						},
					},
					loans: true,
				},
			});

			if (!user) {
				return Response.json({ error: "User not found" }, {
					status: 404,
					headers: CORS_HEADERS,
				});
			}

			return Response.json(user, { headers: CORS_HEADERS });
		}

		// Get current user from Authorization header (if implemented)
		const authHeader = request.headers.get("Authorization");
		if (authHeader) {
			// TODO: Implement JWT token validation
			// For now, return error
			return Response.json({ error: "Authentication not fully implemented" }, {
				status: 401,
				headers: CORS_HEADERS,
			});
		}

		return Response.json({ error: "Missing userId parameter" }, {
			status: 400,
			headers: CORS_HEADERS,
		});
	} catch (error) {
		console.error("Auth API Error:", error);
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
		const { action: actionType, email, password, name } = body;

		if (actionType === "signin") {
			// Simple email-based authentication
			// In production, use proper password hashing and JWT tokens
			const user = await prisma.user.findUnique({
				where: { email },
				include: {
					branch: {
						include: {
							company: true,
						},
					},
				},
			});

			if (!user) {
				return Response.json({ error: "Invalid credentials" }, {
					status: 401,
					headers: CORS_HEADERS,
				});
			}

			// TODO: Verify password hash
			// For now, return user (in production, use bcrypt to verify password)

			return Response.json({
				user: {
					id: user.id,
					email: user.email,
					name: user.name,
					role: user.role,
					branch: user.branch,
				},
				// TODO: Generate JWT token
				token: "temporary_token_" + user.id,
			}, { headers: CORS_HEADERS });
		}

		if (actionType === "signup") {
			// Create new user
			if (!email || !name) {
				return Response.json({ error: "Email and name are required" }, {
					status: 400,
					headers: CORS_HEADERS,
				});
			}

			// Check if user already exists
			const existingUser = await prisma.user.findUnique({
				where: { email },
			});

			if (existingUser) {
				return Response.json({ error: "User already exists" }, {
					status: 409,
					headers: CORS_HEADERS,
				});
			}

			// Generate account number
			const accountNumber = `ACC${Date.now()}${Math.floor(Math.random() * 1000)}`;

			// TODO: Hash password before storing
			const user = await prisma.user.create({
				data: {
					email,
					name,
					accountNumber,
					role: "USER",
				},
				include: {
					branch: {
						include: {
							company: true,
						},
					},
				},
			});

			return Response.json({
				user: {
					id: user.id,
					email: user.email,
					name: user.name,
					role: user.role,
					branch: user.branch,
				},
				token: "temporary_token_" + user.id,
			}, { headers: CORS_HEADERS });
		}

		return Response.json({ error: "Invalid action" }, {
			status: 400,
			headers: CORS_HEADERS,
		});
	} catch (error) {
		console.error("Auth API Error:", error);
		return Response.json({ error: "Internal Server Error" }, {
			status: 500,
			headers: CORS_HEADERS,
		});
	}
}

