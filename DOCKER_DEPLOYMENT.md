# Docker Deployment Guide

This guide covers deploying the Loan Admin application using Docker and Docker Compose.

## Prerequisites

- Docker Engine 20.10+
- Docker Compose 2.0+
- 2GB+ RAM available
- 5GB+ disk space

## Quick Start

### 1. Clone and Navigate

```bash
git clone <repository-url>
cd loan_admin
```

### 2. Configure Environment Variables

Copy the example environment file:

```bash
cp .env.example .env
```

Edit `.env` and update the following if needed:

```env
POSTGRES_PASSWORD=your_secure_password
POSTGRES_USER=postgres
DATABASE_URL_POSTGRESQL=postgresql://postgres:your_secure_password@postgres:5432/loan_admin
```

### 3. Build and Start

Build and start all services:

```bash
docker compose up -d --build
```

This will:
- Build the application image
- Start PostgreSQL database
- Run database migrations
- Start the application server

### 4. Access the Application

- **Application**: http://localhost:3000
- **PgAdmin** (optional): http://localhost:8080 (use `--profile tools` to start)

## Services

### Application (`app`)
- Port: `3000` (configurable via `APP_PORT`)
- Automatically runs migrations on startup
- Health checks enabled

### PostgreSQL (`postgres`)
- Port: `5432` (configurable via `POSTGRES_PORT`)
- Database: `loan_admin` (configurable via `POSTGRES_DB`)
- Data persisted in Docker volume

### PgAdmin (`pgadmin`) - Optional
- Port: `8080` (configurable via `PGADMIN_PORT`)
- Only starts with `--profile tools`
- Default login: `admin@loanadmin.com` / admin`

## Environment Variables

| Variable | Default | Description |
|----------|---------|-------------|
| `POSTGRES_DB` | `loan_admin` | PostgreSQL database name |
| `POSTGRES_USER` | `postgres` | PostgreSQL username |
| `POSTGRES_PASSWORD` | `postgres` | PostgreSQL password |
| `POSTGRES_PORT` | `5432` | PostgreSQL port |
| `DATABASE_URL_POSTGRESQL` | Auto-generated | Full database connection URL |
| `NODE_ENV` | `production` | Node environment |
| `APP_PORT` | `3000` | Application server port |
| `SEED_DATABASE` | `false` | Enable database seeding on startup |

## Common Commands

### Start Services
```bash
docker compose up -d
```

### Stop Services
```bash
docker compose down
```

### View Logs
```bash
# All services
docker compose logs -f

# Specific service
docker compose logs -f app
docker compose logs -f postgres
```

### Rebuild Application
```bash
docker compose up -d --build app
```

### Seed Database
```bash
# Option 1: Set environment variable
SEED_DATABASE=true docker compose up -d

# Option 2: Run seed manually
docker compose exec app npm run prisma:seed
```

### Run Migrations
```bash
docker compose exec app npx prisma migrate deploy
```

### Access Database
```bash
# Using psql
docker compose exec postgres psql -U postgres -d loan_admin

# Using Prisma Studio
docker compose exec app npx prisma studio
```

### Clean Up Everything
```bash
# Stop and remove containers, networks, and volumes
docker compose down -v
```

## Database Seeding

To seed the database with sample data on startup, set:

```bash
SEED_DATABASE=true docker compose up -d
```

Or manually seed after startup:

```bash
docker compose exec app npm run prisma:seed
```

## Production Deployment

### 1. Update Environment Variables

Create a `.env` file with production values:

```env
NODE_ENV=production
POSTGRES_PASSWORD=<strong-production-password>
DATABASE_URL_POSTGRESQL=postgresql://postgres:<strong-password>@postgres:5432/loan_admin
SEED_DATABASE=false
```

### 2. Security Considerations

- **Change default passwords** in production
- Use **strong passwords** for database credentials
- Consider using **Docker secrets** or environment variable management
- Enable **HTTPS** in production (use reverse proxy like nginx)
- Restrict **database port exposure** in production

### 3. Resource Limits

Add resource limits to `docker-compose.yml`:

```yaml
services:
  app:
    deploy:
      resources:
        limits:
          cpus: '1'
          memory: 1G
        reservations:
          cpus: '0.5'
          memory: 512M
```

### 4. Health Checks

Health checks are already configured. Monitor with:

```bash
docker compose ps
```

## Troubleshooting

### Application won't start

1. Check logs:
   ```bash
   docker compose logs app
   ```

2. Verify database is healthy:
   ```bash
   docker compose ps
   ```

3. Check database connection:
   ```bash
   docker compose exec app npx prisma db execute --stdin <<< "SELECT 1"
   ```

### Database connection errors

1. Ensure database is ready:
   ```bash
   docker compose ps postgres
   ```

2. Verify connection string in `.env` matches docker-compose settings

3. Check network connectivity:
   ```bash
   docker compose exec app ping postgres
   ```

### Migration failures

1. Check migration status:
   ```bash
   docker compose exec app npx prisma migrate status
   ```

2. Reset migrations (⚠️ destroys data):
   ```bash
   docker compose exec app npx prisma migrate reset
   ```

### Port conflicts

If ports are already in use, update `.env`:

```env
APP_PORT=3001
POSTGRES_PORT=5433
```

### Permission issues

If you encounter permission issues with volumes:

```bash
sudo chown -R $USER:$USER <volume-path>
```

## Building for Different Platforms

Build for specific platform (e.g., ARM64 for Apple Silicon):

```bash
docker compose build --platform linux/amd64
```

## Monitoring

### Check service health
```bash
docker compose ps
```

### View resource usage
```bash
docker stats
```

### Access application logs
```bash
docker compose logs -f --tail=100 app
```

## Next Steps

- Set up reverse proxy (nginx/traefik) for HTTPS
- Configure backup strategy for PostgreSQL
- Set up log aggregation
- Configure monitoring and alerting
- Review security best practices

## Support

For issues or questions:
1. Check application logs: `docker compose logs app`
2. Check database logs: `docker compose logs postgres`
3. Review environment variables
4. Check Docker resource usage

