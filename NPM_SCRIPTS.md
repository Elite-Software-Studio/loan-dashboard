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
| `db:reset` | `npm run db:reset` | Reset database (deletes data) |

## 🔧 Prisma Scripts

| Script | Command | Description |
|--------|---------|-------------|
| `prisma:generate` | `npm run prisma:generate` | Generate Prisma Client |
| `prisma:migrate` | `npm run prisma:migrate` | Run database migrations |
| `prisma:studio` | `npm run prisma:studio` | Open Prisma Studio GUI |
| `prisma:reset` | `npm run prisma:reset` | Reset database and migrations |
| `prisma:seed` | `npm run prisma:seed` | Seed database with sample data |

## ☸️ k3d Scripts

### Setup & Verification

| Script | Command | Description |
|--------|---------|-------------|
| `k3d:verify` | `npm run k3d:verify` | Verify k3d installation and setup |
| `k3d:setup` | `npm run k3d:setup` | Create k3d cluster (alias: `k3d:create`) |
| `k3d:create` | `npm run k3d:create` | Create k3d cluster (alias: `k3d:setup`) |
| `k3d:teardown` | `npm run k3d:teardown` | Delete k3d cluster (alias: `k3d:delete`) |
| `k3d:delete` | `npm run k3d:delete` | Delete k3d cluster (alias: `k3d:teardown`) |

### Build & Deploy

| Script | Command | Description |
|--------|---------|-------------|
| `k3d:build` | `npm run k3d:build` | Build Docker image |
| `k3d:load` | `npm run k3d:load` | Load Docker image into k3d cluster |
| `k3d:build-load` | `npm run k3d:build-load` | Build and load image in one command |
| `k3d:deploy` | `npm run k3d:deploy` | Deploy to Kubernetes cluster |
| `k3d:full` | `npm run k3d:full` | Build, load, deploy, and show status |

### Monitoring & Debugging

| Script | Command | Description |
|--------|---------|-------------|
| `k3d:status` | `npm run k3d:status` | Show all resources in cluster |
| `k3d:logs` | `npm run k3d:logs` | Follow application logs |
| `k3d:logs:postgres` | `npm run k3d:logs:postgres` | Follow PostgreSQL logs |
| `k3d:port-forward` | `npm run k3d:port-forward` | Port forward to access app locally |

## 🚀 Common Workflows

### Initial Setup

```bash
# 1. Verify k3d setup
npm run k3d:verify

# 2. Create cluster
npm run k3d:setup

# 3. Build, load, and deploy
npm run k3d:full
```

### Daily Development

```bash
# Rebuild and redeploy
npm run k3d:build-load
npm run k3d:deploy

# Check status
npm run k3d:status

# View logs
npm run k3d:logs
```

### Quick Testing

```bash
# One command: build, load, deploy, status
npm run k3d:full

# Access application
npm run k3d:port-forward
# Then open http://localhost:3000
```

### Cleanup

```bash
# Delete cluster
npm run k3d:teardown
```

## 📝 Examples

### Full Deployment Workflow

```bash
# Complete workflow from scratch
npm run k3d:setup          # Create cluster
npm run k3d:build          # Build image
npm run k3d:load           # Load image
npm run k3d:deploy         # Deploy to cluster
npm run k3d:status         # Check everything is running
npm run k3d:port-forward   # Access app (in another terminal)
```

### Quick Iteration

```bash
# After code changes
npm run k3d:build-load     # Rebuild and reload
npm run k3d:deploy         # Redeploy
npm run k3d:logs           # Watch logs
```

### Database Operations

```bash
# Run migrations in cluster
kubectl exec -it -n loan-admin deployment/loan-admin-app -- npx prisma migrate deploy

# Seed database
kubectl exec -it -n loan-admin deployment/loan-admin-app -- npm run prisma:seed
```

## 🎯 Quick Reference

**Most used commands:**
- `npm run k3d:verify` - Check if everything is ready
- `npm run k3d:setup` - Create cluster
- `npm run k3d:full` - Build, deploy, and show status
- `npm run k3d:logs` - Watch application logs
- `npm run k3d:status` - Check cluster status

## 📚 Related Documentation

- [K3D_QUICKSTART.md](./K3D_QUICKSTART.md) - Quick start guide
- [K3D_LOCAL_TESTING.md](./K3D_LOCAL_TESTING.md) - Detailed k3d guide
- [DEPLOYMENT_OVERVIEW.md](./DEPLOYMENT_OVERVIEW.md) - All deployment options

