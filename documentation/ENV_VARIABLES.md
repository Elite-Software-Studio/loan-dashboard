# Environment Variables

This document describes all environment variables used in the project.

## Required Variables

Create a `.env` file in the root directory with the following variables:

### Database Connection

```env
# Connection string for your PostgreSQL database
DATABASE_URL_POSTGRESQL="postgresql://postgres:postgres@localhost:5432/loan_admin?schema=public"
```

### PostgreSQL Docker Container Variables

These variables are used by `docker-compose.yml` to configure the PostgreSQL container:

```env
# PostgreSQL user (default: postgres)
POSTGRES_USER=postgres

# PostgreSQL password (default: postgres)
POSTGRES_PASSWORD=postgres

# Database name (default: loan_admin)
POSTGRES_DB=loan_admin

# Host port mapping (default: 5432)
POSTGRES_PORT=5432
```

**Note:** The `docker-compose.yml` uses default values if these variables are not set, but it's recommended to set them explicitly in your `.env` file.

### JWT Configuration

```env
# Secret key for JWT token signing (CHANGE IN PRODUCTION!)
JWT_SECRET="your-super-secret-jwt-key-change-in-production"

# JWT token expiration time (default: 7d)
JWT_EXPIRES_IN="7d"
```

### Application Configuration

```env
# Node environment (development, production, test)
NODE_ENV=development

# Server port (default: 3000)
PORT=3000
```

## Example .env File

```env
# Database Connection
DATABASE_URL_POSTGRESQL="postgresql://postgres:postgres@localhost:5432/loan_admin?schema=public"

# PostgreSQL Docker Container Configuration
POSTGRES_USER=postgres
POSTGRES_PASSWORD=postgres
POSTGRES_DB=loan_admin
POSTGRES_PORT=5432

# JWT Configuration
JWT_SECRET="your-super-secret-jwt-key-change-in-production"
JWT_EXPIRES_IN="7d"

# Environment
NODE_ENV=development
PORT=3000
```

## Important Notes

1. **Never commit `.env` to version control** - It's already in `.gitignore`
2. **Use strong passwords in production** - The default `postgres` password is for development only
3. **Keep JWT_SECRET secure** - Use a long, random string in production
4. **Match DATABASE_URL_POSTGRESQL with Docker variables** - Ensure the connection string matches your `POSTGRES_USER`, `POSTGRES_PASSWORD`, `POSTGRES_DB`, and `POSTGRES_PORT` values

## Customizing Database Credentials

To change the database credentials:

1. Update your `.env` file:
   ```env
   POSTGRES_USER=myuser
   POSTGRES_PASSWORD=mypassword
   POSTGRES_DB=mydatabase
   ```

2. Update `DATABASE_URL_POSTGRESQL` to match:
   ```env
   DATABASE_URL_POSTGRESQL="postgresql://myuser:mypassword@localhost:5432/mydatabase?schema=public"
   ```

3. Restart the database:
   ```bash
   npm run db:reset
   ```

This will recreate the container with the new credentials.
