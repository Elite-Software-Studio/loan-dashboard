# NPM Scripts Reference

This document lists all available npm scripts for the Loan Admin project.

## 📋 General Scripts

| Script | Command | Description |
|--------|---------|-------------|
| `build` | `npm run build` | Build the application for production |
| `dev` | `npm run dev` | Start development server |
| `start` | `npm run start` | Start production server |
| `typecheck` | `npm run typecheck` | Type check the codebase |

## 🗄️ Database Scripts

| Script | Command | Description |
|--------|---------|-------------|
| `db:start` | `npm run db:start` | Start PostgreSQL with Docker Compose |
| `db:stop` | `npm run db:stop` | Stop PostgreSQL containers |
| `db:logs` | `npm run db:logs` | View PostgreSQL logs |
| `db:reset` | `npm run db:reset` | Reset database (⚠️ deletes all data) |

## 🔧 Prisma Scripts

| Script | Command | Description |
|--------|---------|-------------|
| `prisma:generate` | `npm run prisma:generate` | Generate Prisma Client |
| `prisma:migrate` | `npm run prisma:migrate` | Run database migrations |
| `prisma:studio` | `npm run prisma:studio` | Open Prisma Studio GUI |
| `prisma:reset` | `npm run prisma:reset` | Reset database and migrations |
| `prisma:seed` | `npm run prisma:seed` | Seed database with sample data |
| `prisma:create-default-branch` | `npm run prisma:create-default-branch` | Create default branch in database |

