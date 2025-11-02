import { describe, it, expect } from "vitest";
import {
	formatCurrency,
	formatDate,
	getUserInitials,
	isValidEmail,
	isValidCreditScore,
	isValidRiskScore,
	capitalize,
	isEmpty,
} from "../utils";

describe("utils", () => {
	describe("formatCurrency", () => {
		it("should format currency correctly", () => {
			expect(formatCurrency(1234.56)).toBe("$1,234.56");
			expect(formatCurrency(0)).toBe("$0.00");
			expect(formatCurrency(1000000)).toBe("$1,000,000.00");
		});
	});

	describe("formatDate", () => {
		it("should format date correctly", () => {
			const date = new Date("2024-01-15");
			const formatted = formatDate(date);
			expect(formatted).toContain("Jan");
			expect(formatted).toContain("15");
			expect(formatted).toContain("2024");
		});
	});

	describe("getUserInitials", () => {
		it("should get initials from full name", () => {
			expect(getUserInitials("John Doe")).toBe("JD");
			expect(getUserInitials("Mary Jane Watson")).toBe("MJ");
			expect(getUserInitials("A")).toBe("A");
		});
	});

	describe("isValidEmail", () => {
		it("should validate email addresses", () => {
			expect(isValidEmail("test@example.com")).toBe(true);
			expect(isValidEmail("user.name@domain.co.uk")).toBe(true);
			expect(isValidEmail("invalid")).toBe(false);
			expect(isValidEmail("invalid@")).toBe(false);
			expect(isValidEmail("@invalid.com")).toBe(false);
		});
	});

	describe("isValidCreditScore", () => {
		it("should validate credit scores", () => {
			expect(isValidCreditScore(300)).toBe(true);
			expect(isValidCreditScore(750)).toBe(true);
			expect(isValidCreditScore(850)).toBe(true);
			expect(isValidCreditScore(299)).toBe(false);
			expect(isValidCreditScore(851)).toBe(false);
		});
	});

	describe("isValidRiskScore", () => {
		it("should validate risk scores", () => {
			expect(isValidRiskScore(0)).toBe(true);
			expect(isValidRiskScore(9)).toBe(true);
			expect(isValidRiskScore(18)).toBe(true);
			expect(isValidRiskScore(-1)).toBe(false);
			expect(isValidRiskScore(19)).toBe(false);
		});
	});

	describe("capitalize", () => {
		it("should capitalize first letter", () => {
			expect(capitalize("hello")).toBe("Hello");
			expect(capitalize("WORLD")).toBe("World");
			expect(capitalize("a")).toBe("A");
		});
	});

	describe("isEmpty", () => {
		it("should check if value is empty", () => {
			expect(isEmpty(null)).toBe(true);
			expect(isEmpty(undefined)).toBe(true);
			expect(isEmpty("")).toBe(true);
			expect(isEmpty("   ")).toBe(true);
			expect(isEmpty([])).toBe(true);
			expect(isEmpty({})).toBe(true);
			expect(isEmpty("hello")).toBe(false);
			expect(isEmpty([1, 2, 3])).toBe(false);
			expect(isEmpty({ key: "value" })).toBe(false);
		});
	});
});
