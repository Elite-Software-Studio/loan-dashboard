# Multi-stage Dockerfile for production deployment

# Stage 1: Install all dependencies (including dev dependencies for build)
FROM node:20-alpine AS deps
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci

# Stage 2: Build the application
FROM node:20-alpine AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
# Generate Prisma Client
RUN npx prisma generate
# Build the application
RUN npm run build

# Stage 3: Production runtime
FROM node:20-alpine AS runner
WORKDIR /app

# Install PostgreSQL client for database health checks
RUN apk add --no-cache postgresql-client

# Create a non-root user for security
RUN addgroup --system --gid 1001 nodejs && \
    adduser --system --uid 1001 reactrouter

# Copy package files
COPY package.json package-lock.json ./

# Install only production dependencies
RUN npm ci --omit=dev && \
    npm cache clean --force

# Copy Prisma schema and generate client in production
COPY prisma ./prisma
RUN npx prisma generate

# Copy built application from builder stage
COPY --from=builder --chown=reactrouter:nodejs /app/build ./build

# Copy entrypoint script
COPY docker-entrypoint.sh ./
RUN chmod +x docker-entrypoint.sh

# Switch to non-root user
USER reactrouter

# Expose port (default for React Router)
EXPOSE 3000

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=40s --retries=3 \
  CMD node -e "require('http').get('http://localhost:3000', (r) => {process.exit(r.statusCode === 200 ? 0 : 1)})"

# Use entrypoint script for database migrations
ENTRYPOINT ["./docker-entrypoint.sh"]
CMD ["npm", "run", "start"]
