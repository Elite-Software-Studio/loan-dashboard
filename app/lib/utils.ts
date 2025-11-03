/**
 * Utility functions used throughout the application
 */

/**
 * Format currency amount to display string
 */
export function formatCurrency(amount: number, currency: string = "USD"): string {
	return new Intl.NumberFormat("en-US", {
		style: "currency",
		currency,
	}).format(amount);
}

/**
 * Format date to display string
 */
export function formatDate(date: Date | string, options?: Intl.DateTimeFormatOptions): string {
	const dateObj = typeof date === "string" ? new Date(date) : date;
	return new Intl.DateTimeFormat("en-US", {
		year: "numeric",
		month: "short",
		day: "numeric",
		...options,
	}).format(dateObj);
}

/**
 * Format date and time to display string
 */
export function formatDateTime(date: Date | string): string {
	const dateObj = typeof date === "string" ? new Date(date) : date;
	return new Intl.DateTimeFormat("en-US", {
		year: "numeric",
		month: "short",
		day: "numeric",
		hour: "2-digit",
		minute: "2-digit",
	}).format(dateObj);
}

/**
 * Get user initials from name
 */
export function getUserInitials(name: string): string {
	return name
		.split(" ")
		.map((n) => n[0])
		.join("")
		.toUpperCase()
		.slice(0, 2);
}

/**
 * Validate email address
 */
export function isValidEmail(email: string): boolean {
	const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
	return emailRegex.test(email);
}

/**
 * Validate credit score
 */
export function isValidCreditScore(score: number): boolean {
	return score >= 300 && score <= 850;
}

/**
 * Validate risk score
 */
export function isValidRiskScore(score: number): boolean {
	return score >= 0 && score <= 18;
}

/**
 * Validate rate percentage
 */
export function isValidRate(rate: number): boolean {
	return rate >= 0 && rate <= 100;
}

/**
 * Debounce function for performance optimization
 */
export function debounce<T extends (...args: unknown[]) => unknown>(
	func: T,
	wait: number
): (...args: Parameters<T>) => void {
	let timeout: NodeJS.Timeout | null = null;

	return function executedFunction(...args: Parameters<T>) {
		const later = () => {
			timeout = null;
			func(...args);
		};

		if (timeout) {
			clearTimeout(timeout);
		}
		timeout = setTimeout(later, wait);
	};
}

/**
 * Sleep/delay utility for async operations
 */
export function sleep(ms: number): Promise<void> {
	return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * Safe parse JSON with error handling
 */
export function safeJsonParse<T>(json: string, fallback: T): T {
	try {
		return JSON.parse(json) as T;
	} catch {
		return fallback;
	}
}

/**
 * Capitalize first letter of string
 */
export function capitalize(str: string): string {
	return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
}

/**
 * Convert enum-like object to array of values
 */
export function enumToArray<T extends Record<string, string | number>>(enumObject: T): Array<T[keyof T]> {
	return Object.values(enumObject) as Array<T[keyof T]>;
}

/**
 * Check if value is empty (null, undefined, empty string, empty array)
 */
export function isEmpty(value: unknown): boolean {
	if (value === null || value === undefined) {
		return true;
	}
	if (typeof value === "string") {
		return value.trim().length === 0;
	}
	if (Array.isArray(value)) {
		return value.length === 0;
	}
	if (typeof value === "object") {
		return Object.keys(value).length === 0;
	}
	return false;
}
