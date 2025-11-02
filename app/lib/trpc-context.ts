// tRPC Context for branch-aware operations
export interface Context {
	userId?: string;
	branchId?: string;
	role?: string;
	// Allow branchId to be passed explicitly for queries (e.g., from headers or session)
}

// Helper function to get branchId from various sources
export function getBranchId(context?: Context, inputBranchId?: string): string | undefined {
	// Priority: explicit input > context > undefined
	return inputBranchId || context?.branchId;
}

// Helper to check if user has access to branch
export function canAccessBranch(
	userBranchId: string | null | undefined,
	requestedBranchId: string | undefined,
	userRole: string | undefined
): boolean {
	// Super admin (no branchId) can access all branches
	if (!userBranchId && userRole === "ADMIN") {
		return true;
	}
	
	// User can only access their own branch
	if (userBranchId && requestedBranchId) {
		return userBranchId === requestedBranchId;
	}
	
	// If no requested branch and user has a branch, allow access to their branch
	if (!requestedBranchId && userBranchId) {
		return true;
	}
	
	return false;
}

