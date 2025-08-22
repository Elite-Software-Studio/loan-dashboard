# Loan Admin System Setup Guide

This project uses Prisma, tRPC, and PostgreSQL with Docker for a full-stack loan administration system.

## Prerequisites

- Docker and Docker Compose installed
- Node.js 18+ and npm
- Git

## Quick Start

### 1. Start the Database

```bash
# Start PostgreSQL and pgAdmin
docker-compose up -d

# Verify containers are running
docker-compose ps
```

**Database Access:**

- PostgreSQL: `localhost:5432`
    - Database: `loan_admin`
    - Username: `postgres`
    - Password: `postgres`
- pgAdmin: `http://localhost:8080`
    - Email: `admin@loanadmin.com`
    - Password: `admin`

### 2. Install Dependencies

```bash
npm install
```

### 3. Set up the Database

```bash
# Generate Prisma client
npx prisma generate

# Run database migrations
npx prisma migrate dev --name init

# (Optional) Seed the database
npx prisma db seed
```

### 4. Start the Development Server

```bash
npm run dev
```

The application will be available at `http://localhost:5173`

## Project Structure

```
loan_admin/
├── app/
│   ├── api/trpc/          # tRPC API routes
│   ├── components/        # React components
│   ├── lib/              # tRPC and Prisma setup
│   └── routes/           # React Router routes
├── prisma/               # Database schema and migrations
├── docker-compose.yml    # PostgreSQL and pgAdmin setup
└── .env                  # Environment variables
```

## Key Features

- **User Management**: Create and manage users with different roles
- **Loan Management**: Create loans, track status, and manage approvals
- **Real-time Updates**: tRPC provides type-safe API calls with automatic updates
- **Database**: PostgreSQL with Prisma ORM for type-safe database operations

## API Endpoints

The tRPC API provides the following procedures:

- `getUsers` - Fetch all users with their loans
- `createUser` - Create a new user
- `getLoans` - Fetch all loans with user information
- `createLoan` - Create a new loan
- `updateLoanStatus` - Update loan status

## Development

### Database Schema Changes

```bash
# After modifying prisma/schema.prisma
npx prisma migrate dev --name description_of_changes
npx prisma generate
```

### Viewing the Database

```bash
# Open Prisma Studio
npx prisma studio

# Or use pgAdmin at http://localhost:8080
```

### Stopping the Database

```bash
docker-compose down
```

## Troubleshooting

### Database Connection Issues

1. Ensure Docker containers are running: `docker-compose ps`
2. Check the `.env` file has correct DATABASE_URL
3. Verify PostgreSQL is accessible on port 5432

### Prisma Issues

1. Regenerate the client: `npx prisma generate`
2. Reset the database: `npx prisma migrate reset`
3. Check schema syntax: `npx prisma validate`

### tRPC Issues

1. Ensure the API route is accessible at `/api/trpc`
2. Check browser console for network errors
3. Verify the TRPCProvider is wrapping your app

## Production Considerations

- Change default passwords in docker-compose.yml
- Use environment variables for sensitive data
- Set up proper SSL/TLS for database connections
- Implement authentication and authorization
- Add rate limiting and input validation
- Set up proper logging and monitoring
