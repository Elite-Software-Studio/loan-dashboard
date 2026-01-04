# Loan Admin System Setup Guide

This project uses Prisma, React Router, and PostgreSQL for a full-stack loan administration system.

## Prerequisites

- Node.js 24+ and npm
- PostgreSQL database (local installation or cloud service)
- Git

## Quick Start

### 1. Set Up Your Database

You'll need a PostgreSQL database. You can use:

- **Local PostgreSQL**: Install PostgreSQL on your machine
- **Cloud Services**: 
  - Neon (https://neon.tech) - Free tier available
  - Supabase (https://supabase.com) - Free tier available
  - AWS RDS, Google Cloud SQL, Azure Database, etc.

**Database Configuration:**

Create a database and note the connection string. It should look like:
```
postgresql://username:password@host:port/database_name
```
    - Password: `admin`

### 2. Install Dependencies

```bash
npm install
```

### 3. Configure Environment Variables

Create a `.env` file in the root directory:

```env
DATABASE_URL_POSTGRESQL="postgresql://username:password@host:port/database_name"
JWT_SECRET="your-super-secret-jwt-key-change-in-production"
JWT_EXPIRES_IN="7d"
```

Replace the connection string with your actual PostgreSQL connection details.

### 4. Set up the Database

```bash
# Generate Prisma client
npm run prisma:generate

# Run database migrations
npm run prisma:migrate

# (Optional) Seed the database with sample data
npm run prisma:seed
```

### 5. Start the Development Server

```bash
npm run dev
```

The application will be available at `http://localhost:5173`

## Project Structure

```
loan_admin/
├── app/
│   ├── api/              # REST API route handlers
│   ├── components/       # React components
│   ├── lib/             # Utilities (JWT, Prisma, etc.)
│   └── routes/          # React Router page routes
├── prisma/              # Database schema and migrations
│   ├── schema.prisma    # Prisma schema definition
│   └── migrations/      # Database migration files
└── .env                 # Environment variables
```

## Key Features

- **User Management**: Create and manage users with different roles
- **Loan Management**: Create loans, track status, and manage approvals
- **RESTful API**: Type-safe API endpoints with JWT authentication
- **Database**: PostgreSQL with Prisma ORM for type-safe database operations
- **Admin Dashboard**: React-based admin interface

## API Endpoints

The REST API provides the following endpoints:

- `POST /api/auth` - Sign in / Sign up
- `GET /api/users` - Fetch all users
- `GET /api/loans` - Fetch all loans
- `POST /api/loans` - Create a new loan
- `PUT /api/loans` - Update loan
- `GET /api/payments` - Fetch payments
- `POST /api/payments` - Create payment
- `GET /api/transactions` - Fetch transactions
- `GET /api/budgets` - Fetch budgets

See `README.md` for complete API documentation.

## Development

### Database Schema Changes

```bash
# After modifying prisma/schema.prisma
npx prisma migrate dev --name description_of_changes
npx prisma generate
```

### Viewing the Database

```bash
# Open Prisma Studio (visual database browser)
npm run prisma:studio
```

This will open a web interface at `http://localhost:5555` where you can view and edit your database.

## Troubleshooting

### Database Connection Issues

1. Verify your PostgreSQL database is running and accessible
2. Check the `.env` file has correct `DATABASE_URL_POSTGRESQL`
3. Test your connection string with a PostgreSQL client
4. Ensure your database user has proper permissions

### Prisma Issues

1. Regenerate the client: `npm run prisma:generate`
2. Reset the database: `npm run prisma:reset` (⚠️ This will delete all data)
3. Check schema syntax: `npx prisma validate`
4. If migrations are out of sync: `npx prisma migrate resolve --applied <migration_name>`

### API Issues

1. Ensure the API routes are accessible at `/api/*`
2. Check browser console for network errors
3. Verify JWT token is being sent in Authorization header
4. Check server logs for detailed error messages

## Production Considerations

- Use strong, unique `JWT_SECRET` in production
- Use environment variables for all sensitive data
- Set up proper SSL/TLS for database connections
- Implement rate limiting and input validation
- Set up proper logging and monitoring
- Use a managed PostgreSQL service for production
- Regularly backup your database
