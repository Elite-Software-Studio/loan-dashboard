# Branch Management System

This document describes the multi-branch architecture implemented in the Loan Admin system.

## Overview

The system now supports **multi-branch operations** where:
- Each branch operates independently
- All data (users, loans, payments, documents) is scoped to branches
- Users can only access data from their assigned branch
- Super admins (no branch assigned) can access all branches

## Database Schema

### Branch Model

```prisma
model Branch {
  id          String   @id @default(cuid())
  code        String   @unique  // e.g., "BR001", "NYC", "LAX"
  name        String
  address     String?
  city        String?
  state       String?
  country     String   @default("USA")
  phone       String?
  email       String?
  isActive    Boolean  @default(true)
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
  
  users       User[]
  loans       Loan[]
  payments    Payment[]
  documents   Document[]
}
```

### Data Relationships

All major entities are linked to branches:

- **User**: `branchId` (nullable - null for super admin)
- **Loan**: `branchId` (required)
- **Payment**: `branchId` (required)
- **Document**: `branchId` (required)

## API Usage

### Branch Management

```typescript
// Get all branches
const branches = await trpc.getBranches.useQuery();

// Get specific branch
const branch = await trpc.getBranch.useQuery({ id: branchId });

// Create branch
await trpc.createBranch.useMutation().mutate({
  code: "NYC",
  name: "New York Branch",
  city: "New York",
  state: "NY",
});

// Update branch
await trpc.updateBranch.useMutation().mutate({
  id: branchId,
  name: "New York Downtown Branch",
  isActive: true,
});
```

### Branch-Aware Queries

All queries automatically filter by branch when `branchId` is provided in context:

```typescript
// Get users for current branch (from context)
const users = await trpc.getUsers.useQuery();

// Get users for specific branch
const users = await trpc.getUsers.useQuery({ branchId: "branch-id" });

// Get loans for current branch
const loans = await trpc.getLoans.useQuery();

// Create loan (branchId auto-set from context or user)
await trpc.createLoan.useMutation().mutate({
  loanNumber: "LOAN001",
  type: "HOME_LOAN",
  amount: 500000,
  rate: 9.5,
  userId: "user-id",
  startDate: new Date(),
  // branchId will be set automatically
});
```

## Context and Authorization

### How Branch Context Works

1. **User's Branch**: Each user has a `branchId` (except super admins)
2. **Context Extraction**: The system extracts `branchId` from:
   - User session/auth token
   - Explicit input parameter
   - User's profile (for default branch)

3. **Automatic Filtering**: All queries filter by `branchId` when available

### Authorization Rules

- **Regular Users**: Can only access their branch's data
- **Branch Managers**: Can only access their branch's data
- **Super Admins** (`branchId = null`): Can access all branches

### Example Context Flow

```typescript
// 1. User logs in
const user = {
  id: "user-123",
  branchId: "branch-nyc",
  role: "MANAGER"
};

// 2. Context is set (from session/auth)
const ctx = {
  userId: user.id,
  branchId: user.branchId,
  role: user.role
};

// 3. Query automatically filters by branch
const loans = await prisma.loan.findMany({
  where: { branchId: ctx.branchId }
});
```

## Implementation Details

### tRPC Middleware

The `branchProcedure` middleware:
- Extracts `branchId` from context
- Makes it available to all procedures
- Allows explicit override via input parameter

### Query Filtering

All branch-aware procedures use:

```typescript
const branchId = getBranchId(ctx, input?.branchId);

return await prisma.loan.findMany({
  where: branchId ? { branchId } : undefined,
  // ... other options
});
```

### Creating Resources

When creating loans/payments/documents:
1. First check explicit `branchId` in input
2. Then check context `branchId`
3. Finally, use user's `branchId`
4. Error if no `branchId` found (required for most resources)

## Migration Strategy

### Existing Data

For existing data without branch assignments:

1. **Create a default branch**:
   ```sql
   INSERT INTO branches (id, code, name, country, "isActive")
   VALUES ('default-branch-id', 'DEFAULT', 'Default Branch', 'USA', true);
   ```

2. **Migrate existing data**:
   ```sql
   UPDATE users SET "branchId" = 'default-branch-id' WHERE "branchId" IS NULL;
   UPDATE loans SET "branchId" = (SELECT "branchId" FROM users WHERE users.id = loans."userId")
   WHERE "branchId" IS NULL;
   ```

### Migration Steps

```bash
# 1. Generate migration
npx prisma migrate dev --name add_branch_support

# 2. Review migration file
# Edit prisma/migrations/.../migration.sql if needed

# 3. Apply migration
npx prisma migrate deploy

# 4. Seed default branch
# Update seed.ts to create default branch
npm run prisma:seed
```

## Frontend Integration

### Getting User's Branch

```typescript
// In your component
const { user } = useAuth();
const branchId = user?.branchId;

// Use in queries
const { data: loans } = trpc.getLoans.useQuery(
  branchId ? { branchId } : undefined
);
```

### Branch Selector (for Super Admin)

```typescript
const [selectedBranch, setSelectedBranch] = useState(user?.branchId);

// Get all branches
const { data: branches } = trpc.getBranches.useQuery();

// Query with selected branch
const { data: loans } = trpc.getLoans.useQuery({
  branchId: selectedBranch || undefined
});
```

## Best Practices

### 1. Always Set Branch Context

Ensure `branchId` is always available in context from user session/auth.

### 2. Validate Branch Access

Before allowing operations, verify user has access to the branch:

```typescript
if (user.branchId && user.branchId !== requestedBranchId) {
  throw new Error("Unauthorized: Access denied");
}
```

### 3. Use Branch Codes

Store branch codes (e.g., "NYC", "LAX") for easier reference:
- Display branch code in UI
- Use for filtering/grouping
- Easier to understand than IDs

### 4. Branch Statistics

Dashboard stats are automatically scoped to branch:

```typescript
const stats = await trpc.getDashboardStats.useQuery({
  branchId: currentBranchId
});
// Returns: totalUsers, totalLoans, totalAmount, activeLoans for that branch
```

## Example Workflows

### Branch Manager Workflow

1. User logs in → `branchId` extracted from user profile
2. Dashboard shows only their branch's stats
3. User management shows only their branch's users
4. Loan management shows only their branch's loans

### Super Admin Workflow

1. Super admin logs in → `branchId = null`
2. Can view all branches or select specific branch
3. Dashboard can show:
   - All branches aggregate
   - Specific branch details
   - Branch comparison

## Testing

### Unit Tests

```typescript
// Test branch filtering
it("should only return loans for user's branch", async () => {
  const ctx = { branchId: "branch-1" };
  const loans = await getLoans({ ctx });
  expect(loans.every(loan => loan.branchId === "branch-1")).toBe(true);
});
```

### Integration Tests

```typescript
// Test branch isolation
it("should not allow access to other branch's data", async () => {
  const user = { branchId: "branch-1" };
  const loan = await createLoan({ branchId: "branch-2" }); // Should fail
  expect(loan).toThrow("Unauthorized");
});
```

## Future Enhancements

- **Branch Hierarchy**: Support parent-child branch relationships
- **Cross-Branch Transfers**: Allow moving loans/users between branches
- **Branch Analytics**: Compare performance across branches
- **Regional Management**: Group branches by region
- **Branch-Specific Settings**: Customize settings per branch

