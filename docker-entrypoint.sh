#!/bin/sh
set -e

echo "🚀 Starting Loan Admin Application..."

# Wait for database to be ready
if [ -n "$DATABASE_URL_POSTGRESQL" ]; then
  echo "⏳ Waiting for database to be ready..."
  # Try simple connection test with psql or prisma
  until PGPASSWORD=${POSTGRES_PASSWORD:-postgres} psql -h postgres -U ${POSTGRES_USER:-postgres} -d ${POSTGRES_DB:-loan_admin} -c "SELECT 1" > /dev/null 2>&1 || \
        npx prisma db execute --stdin <<< "SELECT 1" > /dev/null 2>&1; do
    echo "   Database is unavailable - sleeping"
    sleep 2
  done
  echo "✅ Database is ready!"
fi

# Run database migrations
echo "🔄 Running database migrations..."
npx prisma migrate deploy || {
  echo "⚠️  Migration failed, attempting to initialize database..."
  npx prisma migrate dev --name init || true
}

# Seed database if SEED_DATABASE is set to true
if [ "$SEED_DATABASE" = "true" ]; then
  echo "🌱 Seeding database..."
  npx prisma db seed || echo "⚠️  Seeding failed or not configured"
fi

# Start the application
echo "🎯 Starting application server..."
exec "$@"

