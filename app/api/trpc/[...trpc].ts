import { fetchRequestHandler } from "@trpc/server/adapters/fetch";
import { appRouter } from "../../lib/router";

// Loader function for React Router v7
export async function loader({ request }: { request: Request }) {
	return fetchRequestHandler({
		endpoint: "/api/trpc",
		req: request,
		router: appRouter,
		createContext: () => ({}),
	});
}

// Action function for POST requests
export async function action({ request }: { request: Request }) {
	return fetchRequestHandler({
		endpoint: "/api/trpc",
		req: request,
		router: appRouter,
		createContext: () => ({}),
	});
}

// Default export for the component (required by React Router)
export default function TRPCRoute() {
	return null; // This route doesn't render anything
}
