# Seed Data Documentation

## 🌱 What Gets Created

### 👥 Users (5 total)

1. **John Admin** - `admin@loanadmin.com` - Role: ADMIN
2. **Sarah Manager** - `manager@loanadmin.com` - Role: MANAGER
3. **Mike Johnson** - `user1@example.com` - Role: USER
4. **Lisa Chen** - `user2@example.com` - Role: USER
5. **David Wilson** - `user3@example.com` - Role: USER

### 💰 Loans (8 total)

- **Mike Johnson's Loans:**
    - $5,000.00 - APPROVED
    - $25,000.00 - REJECTED
    - $3,000.00 - APPROVED

- **Lisa Chen's Loans:**
    - $12,000.50 - PENDING
    - $8,000.00 - PAID
    - $9,500.00 - ACTIVE

- **David Wilson's Loans:**
    - $7,500.00 - ACTIVE
    - $15,000.00 - PENDING

## 🚀 How to Run

### Option 1: Using npm script

```bash
npm run prisma:seed
```

### Option 2: Direct command

```bash
npx prisma db seed
```

### Option 3: Manual execution

```bash
npx tsx prisma/seed.ts
```

## 📊 Expected Output

```
🌱 Starting database seeding...
🧹 Cleared existing data
👥 Created 5 users
💰 Created 6 loans
➕ Created 2 additional loans

🎉 Database seeding completed successfully!

📊 Sample Data Summary:
   Users: 5
   Total Loans: 8

👤 Users created:
   - John Admin (admin@loanadmin.com) - Role: ADMIN
   - Sarah Manager (manager@loanadmin.com) - Role: MANAGER
   - Mike Johnson (user1@example.com) - Role: USER
   - Lisa Chen (user2@example.com) - Role: USER
   - David Wilson (user3@example.com) - Role: USER

💳 Loan statuses:
   - APPROVED: 2
   - PENDING: 2
   - ACTIVE: 2
   - REJECTED: 1
   - PAID: 1
```

## 🔄 Resetting Data

To clear all data and reseed:

```bash
npm run prisma:reset
npm run prisma:seed
```

## 🎯 Use Cases

This seed data provides:

- **Role testing** - Different user roles for permission testing
- **Status variety** - All loan statuses for UI testing
- **Relationship testing** - Users with multiple loans
- **Realistic amounts** - Various loan amounts for display testing
- **Edge cases** - Rejected loans, paid loans, etc.

## 🚨 Important Notes

- Seed script **clears existing data** before creating new data
- Run after **database migrations** are complete
- Perfect for **development and testing** environments
- **Don't run in production** without backup
