# Branch Management Quick Reference

## 🎯 Key Concepts

- **Branch**: A physical location or organizational unit (e.g., "New York Branch", "Los Angeles Branch")
- **Branch Isolation**: All data is automatically filtered by branch
- **User Assignment**: Users belong to a branch (null for super admin)
- **Data Scoping**: Loans, payments, documents are tied to branches

## 📊 Data Flow

```
User (has branchId) 
  ↓
Creates Loan (auto-assigned branchId)
  ↓
Creates Payment (auto-assigned branchId)
  ↓
Uploads Document (auto-assigned branchId)
```

All queries filter by `branchId` automatically!

## 🔧 Implementation

### 1. Database Schema

- `Branch` model with code, name, address, etc.
- `User.branchId` (nullable - null for super admin)
- `Loan.branchId` (required)
- `Payment.branchId` (required)
- `Document.branchId` (required)

### 2. API Procedures

All procedures are branch-aware:

- `getUsers({ branchId? })` - Filter users by branch
- `getLoans({ branchId? })` - Filter loans by branch
- `getPayments({ branchId? })` - Filter payments by branch
- `getDocuments({ branchId? })` - Filter documents by branch
- `getDashboardStats({ branchId? })` - Branch-specific stats

### 3. Branch Management

- `getBranches()` - List all branches
- `getBranch({ id })` - Get branch details
- `createBranch({ code, name, ... })` - Create new branch
- `updateBranch({ id, ... })` - Update branch

## 📝 Usage Examples

### Get Branch Data

```typescript
// Get all loans for current branch (from user context)
const { data: loans } = trpc.getLoans.useQuery();

// Get loans for specific branch
const { data: loans } = trpc.getLoans.useQuery({ 
  branchId: "branch-id" 
});
```

### Create Branch-Scoped Resources

```typescript
// Create loan (branchId auto-set from user)
await trpc.createLoan.mutate({
  loanNumber: "LOAN001",
  type: "HOME_LOAN",
  amount: 500000,
  rate: 9.5,
  userId: user.id,
  startDate: new Date(),
  // branchId automatically set from user's branch
});
```

### Branch Management

```typescript
// List all branches
const { data: branches } = trpc.getBranches.useQuery();

// Create branch
await trpc.createBranch.mutate({
  code: "NYC",
  name: "New York Branch",
  city: "New York",
  state: "NY",
});
```

## 🔐 Authorization

- **Regular User**: Can only see their branch's data
- **Branch Manager**: Can only see their branch's data
- **Super Admin** (`branchId = null`): Can see all branches

## 🚀 Migration Steps

1. **Generate migration**:
   ```bash
   npx prisma migrate dev --name add_branch_management
   ```

2. **Update seed file** to create branches

3. **Assign existing users** to branches

4. **Test branch filtering**

See [BRANCH_MIGRATION_GUIDE.md](./prisma/migrations/BRANCH_MIGRATION_GUIDE.md) for details.

## 📚 Documentation

- [BRANCH_MANAGEMENT.md](./BRANCH_MANAGEMENT.md) - Complete guide
- [BRANCH_MIGRATION_GUIDE.md](./prisma/migrations/BRANCH_MIGRATION_GUIDE.md) - Migration steps

## 💡 Best Practices

1. **Always set branchId** from user context
2. **Validate branch access** before operations
3. **Use branch codes** for UI display
4. **Filter by branch** in all queries
5. **Handle null branchId** for super admins

