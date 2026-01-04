# Local PostgreSQL Database Setup with Docker

This guide will help you set up a local PostgreSQL database using Docker Compose for development.

## Prerequisites

- Docker Desktop installed and running
  - Download from: https://www.docker.com/products/docker-desktop
  - Make sure Docker is running before proceeding

## Quick Start

### 1. Start the Database

```bash
# Start PostgreSQL container
npm run db:start

# Or use docker compose directly
docker compose up -d
```

This will:
- Pull the PostgreSQL 16 Alpine image (if not already downloaded)
- Create a container named `loan_admin_postgres`
- Start PostgreSQL on port `5432`
- Create a database named `loan_admin`
- Create a persistent volume for data storage

### 2. Verify Database is Running

```bash
# Check container status
docker compose ps

# View logs
npm run db:logs

# Or check health
docker compose ps
```

You should see the postgres container with status "Up" and health "healthy".

### 3. Update Environment Variables

Your `.env` file should have:

```env
DATABASE_URL_POSTGRESQL="postgresql://postgres:postgres@localhost:5432/loan_admin?schema=public"
```

**Default credentials:**
- **Host:** `localhost`
- **Port:** `5432`
- **Database:** `loan_admin`
- **Username:** `postgres`
- **Password:** `postgres`

⚠️ **Security Note:** These are default development credentials. Change them for production!

### 4. Run Database Migrations

```bash
# Generate Prisma client
npm run prisma:generate

# Run migrations
npm run prisma:migrate

# (Optional) Seed the database
npm run prisma:seed
```

### 5. Verify Connection

```bash
# Open Prisma Studio to view your database
npm run prisma:studio

# Or test the health endpoint (if server is running)
curl http://localhost:5173/api/health
```

## Database Management Commands

### Start Database
```bash
npm run db:start
# or
docker compose up -d
```

### Stop Database
```bash
npm run db:stop
# or
docker compose down
```

### View Logs
```bash
npm run db:logs
# or
docker compose logs -f postgres
```

### Reset Database (⚠️ Deletes all data)
```bash
npm run db:reset
# or
docker compose down -v && docker compose up -d
```

This will:
1. Stop and remove containers
2. Delete the volume (all data)
3. Start fresh containers

### Access PostgreSQL CLI
```bash
# Connect to the database
docker compose exec postgres psql -U postgres -d loan_admin

# Or from your local machine (if psql is installed)
psql -h localhost -U postgres -d loan_admin
```

## Customizing the Setup

### Change Database Credentials

Edit `docker-compose.yml`:

```yaml
environment:
  POSTGRES_USER: your_username
  POSTGRES_PASSWORD: your_password
  POSTGRES_DB: your_database_name
```

Then update your `.env` file accordingly and restart:
```bash
npm run db:reset
```

### Change Port

If port 5432 is already in use, change it in `docker-compose.yml`:

```yaml
ports:
  - "5433:5432"  # Use 5433 on host, 5432 in container
```

Update `.env`:
```env
DATABASE_URL_POSTGRESQL="postgresql://postgres:postgres@localhost:5433/loan_admin?schema=public"
```

### Add pgAdmin (Optional)

To add a web-based database management tool, add this to `docker-compose.yml`:

```yaml
  pgadmin:
    image: dpage/pgadmin4:latest
    container_name: loan_admin_pgadmin
    restart: unless-stopped
    environment:
      PGADMIN_DEFAULT_EMAIL: admin@loanadmin.com
      PGADMIN_DEFAULT_PASSWORD: admin
    ports:
      - "8080:80"
    depends_on:
      - postgres
```

Then access pgAdmin at `http://localhost:8080`

## Troubleshooting

### Port Already in Use

If you get an error about port 5432 being in use:

1. Check what's using it:
   ```bash
   lsof -i :5432
   ```

2. Either stop the other service or change the port in `docker-compose.yml`

### Container Won't Start

1. Check Docker is running:
   ```bash
   docker ps
   ```

2. View error logs:
   ```bash
   docker compose logs postgres
   ```

3. Try removing and recreating:
   ```bash
   docker compose down -v
   docker compose up -d
   ```

### Connection Refused

1. Verify container is running:
   ```bash
   docker compose ps
   ```

2. Check if PostgreSQL is ready:
   ```bash
   docker compose exec postgres pg_isready -U postgres
   ```

3. Verify your `.env` file has the correct connection string

### Data Persistence

Data is stored in a Docker volume named `postgres_data`. To see volumes:
```bash
docker volume ls
```

To completely remove data:
```bash
docker compose down -v
```

## Next Steps

Once your database is running:

1. ✅ Database is running (`npm run db:start`)
2. ✅ Environment variables are set (`.env` file)
3. ✅ Migrations are applied (`npm run prisma:migrate`)
4. ✅ Database is seeded (optional: `npm run prisma:seed`)
5. ✅ Start your development server (`npm run dev`)

## Production Note

This setup is for **local development only**. For production:
- Use a managed PostgreSQL service (AWS RDS, Google Cloud SQL, etc.)
- Use strong, unique passwords
- Enable SSL/TLS connections
- Set up proper backups
- Configure firewall rules

