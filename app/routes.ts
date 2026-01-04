import { type RouteConfig, index, route } from "@react-router/dev/routes";

export default [
  index("routes/dashboard.tsx"),
  route("users", "routes/users.tsx"),
  route("user", "routes/userDetails.tsx"),
  route("payments", "routes/payments.tsx"),
  route("loans", "routes/loans.tsx"),
  route("loan", "routes/loanDetails.tsx"),
  route("loan/payments", "routes/paymentHistory.tsx"),
  route("reporting", "routes/reporting.tsx"),
  route("controls", "routes/controls.tsx"),
  route("companies", "routes/companies.tsx"),
  route("api/users", "api/users.ts"),
  route("api/companies", "api/companies.ts"),
  route("api/branches", "api/branches.ts"),
  route("api/auth", "api/auth.ts"),
  route("api/loans", "api/loans.ts"),
  route("api/payments", "api/payments.ts"),
  route("api/documents", "api/documents.ts"),
  route("api/transactions", "api/transactions.ts"),
  route("api/budgets", "api/budgets.ts"),
  route("api/categories", "api/categories.ts"),
  route("api/health", "api/health.ts")
] satisfies RouteConfig;
