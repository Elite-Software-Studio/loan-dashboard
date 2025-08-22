import { type RouteConfig, index, route } from "@react-router/dev/routes";

export default [index("routes/home.tsx"), route("users", "routes/users.tsx"), route("user", "routes/userDetails.tsx"), route("api/users", "api/users.ts"), route("trpc/*", "api/trpc/[...trpc].ts")] satisfies RouteConfig;
