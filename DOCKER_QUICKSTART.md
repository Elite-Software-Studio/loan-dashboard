# Docker Quick Start Guide

## 🚀 Production Deployment

```bash
# 1. Copy environment file
cp .env.example .env

# 2. Edit .env with your settings (optional)
# Defaults work for local testing

# 3. Start everything
docker compose up -d --build

# 4. Access the app
# http://localhost:3000
```

## 📋 Common Commands

| Command | Description |
|---------|-------------|
| `docker compose up -d` | Start all services in background |
| `docker compose down` | Stop all services |
| `docker compose logs -f app` | View application logs |
| `docker compose ps` | Check service status |
| `docker compose exec app npm run prisma:seed` | Seed database |
| `docker compose down -v` | Stop and remove volumes (⚠️ deletes data) |

## 🔧 Environment Variables

Key variables in `.env`:

- `POSTGRES_PASSWORD` - Database password (change in production!)
- `APP_PORT` - Application port (default: 3000)
- `SEED_DATABASE` - Set to `true` to seed on startup

## 🐛 Troubleshooting

**App won't start?**
```bash
docker compose logs app
```

**Database connection issues?**
```bash
docker compose ps  # Check if postgres is healthy
docker compose logs postgres
```

**Rebuild everything:**
```bash
docker compose down
docker compose up -d --build
```

## 📚 Full Documentation

See [DOCKER_DEPLOYMENT.md](./DOCKER_DEPLOYMENT.md) for complete documentation.

