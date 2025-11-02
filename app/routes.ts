import { type RouteConfig, index, route } from "@react-router/dev/routes";

export default [
  index("routes/dashboard.tsx"),
  route("users", "routes/users.tsx"),
  route("user", "routes/userDetails.tsx"),
  route("payments", "routes/payments.tsx"),
  route("loans", "routes/loans.tsx"),
  route("reporting", "routes/reporting.tsx"),
  route("controls", "routes/controls.tsx"),
  route("companies", "routes/companies.tsx"),
  route("api/users", "api/users.ts"),
  route("trpc/*", "api/trpc/[...trpc].ts")
] satisfies RouteConfig;
