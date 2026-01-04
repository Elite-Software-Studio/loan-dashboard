# Database Setup Guide (No Docker Required)

## Quick Setup with Neon (Free PostgreSQL)

### Step 1: Create Free Database

1. Go to [neon.tech](https://neon.tech)
2. Click "Sign Up" and create an account
3. Click "Create New Project"
4. Name it "loan-admin"
5. Choose a region close to you
6. Click "Create Project"

### Step 2: Get Connection String

1. In your project dashboard, click "Connection Details"
2. Copy the connection string that looks like:
    ```
    postgresql://username:password@host/database
    ```

### Step 3: Update Environment File

1. Open your `.env` file
2. Replace the DATABASE_URL with your Neon connection string:
    ```
    DATABASE_URL="your-neon-connection-string-here"
    ```

### Step 4: Run Database Setup

```bash
# Generate Prisma client
npm run prisma:generate

# Run migrations
npm run prisma:migrate

# Start the app
npm run dev
```

## Alternative: Supabase

1. Go to [supabase.com](https://supabase.com)
2. Create account and project
3. Get connection string from Settings > Database
4. Follow steps 3-4 above

## Test Your Setup

Once connected, you should be able to:

- Create users
- Create loans
- View data in the UI
- Use all tRPC endpoints

## Need Help?

If you get stuck, share the error message and I'll help you troubleshoot!
