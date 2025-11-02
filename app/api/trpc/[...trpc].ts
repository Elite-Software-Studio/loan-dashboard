import { fetchRequestHandler } from "@trpc/server/adapters/fetch";
import { appRouter } from "../../lib/router";
import { createContext } from "../../lib/trpc";
import { API_CONFIG } from "../../lib/constants";
import { logger } from "../../lib/logger";

/**
 * Get allowed origin from request or use configured origin
 */
function getAllowedOrigin(request: Request): string {
	const origin = request.headers.get("origin");
	const allowedOrigin = API_CONFIG.CORS_ORIGIN === "*" ? origin || "*" : API_CONFIG.CORS_ORIGIN;
	return allowedOrigin;
}

/**
 * CORS headers for tRPC requests
 */
function getCorsHeaders(request: Request): Record<string, string> {
	return {
		"Access-Control-Allow-Origin": getAllowedOrigin(request),
		"Access-Control-Allow-Methods": "GET, POST, OPTIONS",
		"Access-Control-Allow-Headers": "Content-Type, Authorization",
		"Access-Control-Allow-Credentials": "true",
	};
}

/**
 * Handle GET/OPTIONS requests (queries) for tRPC
 */
export async function loader({ request }: { request: Request }) {
	if (request.method === "OPTIONS") {
		return new Response(null, {
			status: 200,
			headers: getCorsHeaders(request),
		});
	}

	try {
		const response = await fetchRequestHandler({
			endpoint: API_CONFIG.TRPC_ENDPOINT,
			req: request,
			router: appRouter,
			createContext: () => createContext(request),
			onError: ({ error, path }) => {
				logger.error(`tRPC Error in ${path}`, error, { path });
			},
		});

		// Add CORS headers to response
		const corsHeaders = getCorsHeaders(request);
		Object.entries(corsHeaders).forEach(([key, value]) => {
			response.headers.set(key, value);
		});

		return response;
	} catch (error) {
		logger.error("Failed to handle tRPC request", error);
		const corsHeaders = getCorsHeaders(request);
		return new Response(JSON.stringify({ error: "Internal server error" }), {
			status: 500,
			headers: {
				"Content-Type": "application/json",
				...corsHeaders,
			},
		});
	}
}

/**
 * Handle POST requests (mutations) for tRPC
 */
export async function action({ request }: { request: Request }) {
	try {
		const response = await fetchRequestHandler({
			endpoint: API_CONFIG.TRPC_ENDPOINT,
			req: request,
			router: appRouter,
			createContext: () => createContext(request),
			onError: ({ error, path }) => {
				logger.error(`tRPC Error in ${path}`, error, { path });
			},
		});

		// Add CORS headers to response
		const corsHeaders = getCorsHeaders(request);
		Object.entries(corsHeaders).forEach(([key, value]) => {
			response.headers.set(key, value);
		});

		return response;
	} catch (error) {
		logger.error("Failed to handle tRPC request", error);
		const corsHeaders = getCorsHeaders(request);
		return new Response(JSON.stringify({ error: "Internal server error" }), {
			status: 500,
			headers: {
				"Content-Type": "application/json",
				...corsHeaders,
			},
		});
	}
}

export default function TRPCRoute() {
	return null;
}
