import jwt from "jsonwebtoken";

// JWT secret key - in production, use environment variable
const JWT_SECRET = process.env.JWT_SECRET || "your-super-secret-jwt-key-change-in-production";
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || "7d";

export interface JWTPayload {
	userId: string;
	email: string;
	role?: string;
}

/**
 * Generate a JWT token for a user
 */
export function generateToken(payload: JWTPayload): string {
	return jwt.sign(payload, JWT_SECRET, {
		expiresIn: JWT_EXPIRES_IN,
	});
}

/**
 * Verify and decode a JWT token
 */
export function verifyToken(token: string): JWTPayload | null {
	try {
		// Remove "Bearer " prefix if present
		const cleanToken = token.startsWith("Bearer ") ? token.slice(7) : token;
		
		const decoded = jwt.verify(cleanToken, JWT_SECRET) as JWTPayload;
		return decoded;
	} catch (error) {
		console.error("JWT verification error:", error);
		return null;
	}
}

/**
 * Extract token from Authorization header
 */
export function extractTokenFromHeader(authHeader: string | null): string | null {
	if (!authHeader) {
		return null;
	}

	// Remove "Bearer " prefix if present
	return authHeader.startsWith("Bearer ") ? authHeader.slice(7) : authHeader;
}

/**
 * Get user ID from JWT token in Authorization header
 */
export function getUserIdFromRequest(request: Request): string | null {
	const authHeader = request.headers.get("Authorization");
	if (!authHeader) {
		return null;
	}

	const token = extractTokenFromHeader(authHeader);
	if (!token) {
		return null;
	}

	const payload = verifyToken(token);
	return payload?.userId || null;
}

