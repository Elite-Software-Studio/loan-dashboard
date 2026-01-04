import { prisma } from "../lib/prisma";
import bcrypt from "bcrypt";
import { generateToken, verifyToken, getUserIdFromRequest } from "../lib/jwt";

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

		// Get current user from Authorization header using JWT token
		const userIdFromToken = getUserIdFromRequest(request);
		if (userIdFromToken) {
			const user = await prisma.user.findUnique({
				where: { id: userIdFromToken },
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

			// Return user without password
			const { password: _, ...userWithoutPassword } = user;
			return Response.json(userWithoutPassword, { headers: CORS_HEADERS });
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
			// Validate input
			if (!email || !password) {
				return Response.json({ error: "Email and password are required" }, {
					status: 400,
					headers: CORS_HEADERS,
				});
			}

			// Find user by email
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

			// Verify password
			if (!user.password) {
				// User exists but has no password (legacy user)
				// For backward compatibility, allow login without password check
				// In production, you might want to force password reset
				console.warn(`User ${user.id} has no password set`);
			} else {
				const isPasswordValid = await bcrypt.compare(password, user.password);
				if (!isPasswordValid) {
					return Response.json({ error: "Invalid credentials" }, {
						status: 401,
						headers: CORS_HEADERS,
					});
				}
			}

			// Generate JWT token
			const token = generateToken({
				userId: user.id,
				email: user.email,
				role: user.role,
			});

			return Response.json({
				user: {
					id: user.id,
					email: user.email,
					name: user.name,
					role: user.role,
					branch: user.branch,
				},
				token,
			}, { headers: CORS_HEADERS });
		}

		if (actionType === "signup") {
			// Validate input
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

			// Hash password if provided
			let hashedPassword: string | undefined;
			if (password) {
				const saltRounds = 10;
				hashedPassword = await bcrypt.hash(password, saltRounds);
			}

			// Generate account number
			const accountNumber = `ACC${Date.now()}${Math.floor(Math.random() * 1000)}`;

			// Create user with hashed password
			const user = await prisma.user.create({
				data: {
					email,
					name,
					password: hashedPassword,
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

			// Generate JWT token
			const token = generateToken({
				userId: user.id,
				email: user.email,
				role: user.role,
			});

			return Response.json({
				user: {
					id: user.id,
					email: user.email,
					name: user.name,
					role: user.role,
					branch: user.branch,
				},
				token,
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

