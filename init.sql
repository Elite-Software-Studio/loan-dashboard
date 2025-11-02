-- Initialize loan_admin database (PostgreSQL)
-- Note: Database is created by POSTGRES_DB env var, but we can ensure it exists

-- Create extensions if needed
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- You can add any initial SQL here
-- This will be executed when the container starts for the first time
