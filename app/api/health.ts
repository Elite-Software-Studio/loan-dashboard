import { prisma } from "../lib/prisma";

const CORS_HEADERS = {
	"Content-Type": "application/json",
	"Access-Control-Allow-Origin": "*",
	"Access-Control-Allow-Methods": "GET, OPTIONS",
	"Access-Control-Allow-Headers": "Content-Type",
};

interface HealthStatus {
	status: "healthy" | "unhealthy";
	timestamp: string;
	uptime: number;
	checks: {
		server: {
			status: "up" | "down";
			message: string;
		};
		database: {
			status: "up" | "down";
			message: string;
			responseTime?: number;
		};
	};
	version?: string;
}

export async function loader({ request }: { request: Request }) {
	if (request.method === "OPTIONS") {
		return new Response(null, {
			status: 200,
			headers: CORS_HEADERS,
		});
	}

	const healthStatus: HealthStatus = {
		status: "healthy",
		timestamp: new Date().toISOString(),
		uptime: process.uptime(),
		checks: {
			server: {
				status: "up",
				message: "Server is running",
			},
			database: {
				status: "down",
				message: "Database check failed",
			},
		},
	};

	// Check database connectivity
	try {
		const dbStartTime = Date.now();
		await prisma.$queryRaw`SELECT 1`;
		const dbResponseTime = Date.now() - dbStartTime;

		healthStatus.checks.database = {
			status: "up",
			message: "Database connection successful",
			responseTime: dbResponseTime,
		};
	} catch (error: any) {
		healthStatus.status = "unhealthy";
		healthStatus.checks.database = {
			status: "down",
			message: `Database connection failed: ${error.message || "Unknown error"}`,
		};
	}

	// Determine overall status
	if (healthStatus.checks.database.status === "down") {
		healthStatus.status = "unhealthy";
	}

	const statusCode = healthStatus.status === "healthy" ? 200 : 503;

	return Response.json(healthStatus, {
		status: statusCode,
		headers: CORS_HEADERS,
	});
}
