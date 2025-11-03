/**
 * Application-wide constants
 * Centralized configuration values for easy maintenance and updates
 */

/**
 * User roles in the system
 */
export const USER_ROLES = {
	ADMIN: "ADMIN",
	USER: "USER",
	MANAGER: "MANAGER",
} as const;

/**
 * Member types available for users
 */
export const MEMBER_TYPES = {
	REGULAR: "REGULAR",
	ELITE: "ELITE",
	PREMIUM: "PREMIUM",
	VIP: "VIP",
} as const;

/**
 * Loan types supported by the system
 */
export const LOAN_TYPES = {
	HOME_LOAN: "HOME_LOAN",
	CAR_LOAN: "CAR_LOAN",
	BUSINESS_LOAN: "BUSINESS_LOAN",
	PERSONAL_LOAN: "PERSONAL_LOAN",
	EDUCATION_LOAN: "EDUCATION_LOAN",
} as const;

/**
 * Loan status values
 */
export const LOAN_STATUS = {
	PENDING: "PENDING",
	APPROVED: "APPROVED",
	REJECTED: "REJECTED",
	ACTIVE: "ACTIVE",
	PAID: "PAID",
	DEFAULTED: "DEFAULTED",
} as const;

/**
 * Payment types
 */
export const PAYMENT_TYPES = {
	EMI: "EMI",
	LUMP_SUM: "LUMP_SUM",
	PARTIAL: "PARTIAL",
} as const;

/**
 * Document types
 */
export const DOCUMENT_TYPES = {
	ID_PROOF: "ID_PROOF",
	ADDRESS_PROOF: "ADDRESS_PROOF",
	INCOME_PROOF: "INCOME_PROOF",
	BANK_STATEMENT: "BANK_STATEMENT",
	LOAN_AGREEMENT: "LOAN_AGREEMENT",
} as const;

/**
 * Validation constraints
 */
export const VALIDATION = {
	CREDIT_SCORE: {
		MIN: 300,
		MAX: 850,
	},
	RISK_SCORE: {
		MIN: 0,
		MAX: 18,
	},
	RATE: {
		MIN: 0,
		MAX: 100,
	},
	EMAIL_REGEX: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
} as const;

/**
 * Default values
 */
export const DEFAULTS = {
	COUNTRY: "USA",
	MEMBER_TYPE: MEMBER_TYPES.REGULAR,
	USER_ROLE: USER_ROLES.USER,
	MAX_RISK_SCORE: 18.0,
} as const;

/**
 * API configuration
 */
export const API_CONFIG = {
	CORS_ORIGIN: import.meta.env?.VITE_CORS_ORIGIN || "*",
} as const;

/**
 * Local storage keys
 */
export const STORAGE_KEYS = {
	USER: "proloans-user",
	BRANCH: "proloans-branch",
} as const;

/**
 * Navigation items configuration
 */
export const NAVIGATION_ITEMS = [
	{ name: "Dashboard", href: "/", icon: "📊" },
	{ name: "Payments", href: "/payments", icon: "💳" },
	{ name: "Reporting", href: "/reporting", icon: "📈" },
	{ name: "Loans", href: "/loans", icon: "💰" },
	{ name: "Controls", href: "/controls", icon: "⚙️" },
] as const;
