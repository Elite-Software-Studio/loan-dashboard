#!/bin/bash
# Script to update .env file to use local PostgreSQL database

ENV_FILE=".env"
BACKUP_FILE=".env.backup.$(date +%Y%m%d_%H%M%S)"

# Create backup
if [ -f "$ENV_FILE" ]; then
    cp "$ENV_FILE" "$BACKUP_FILE"
    echo "✅ Created backup: $BACKUP_FILE"
fi

# Update DATABASE_URL_POSTGRESQL to local
if [ -f "$ENV_FILE" ]; then
    # Comment out Neon database URL if it exists
    sed -i.bak 's|^DATABASE_URL_POSTGRESQL=.*neon|# &|' "$ENV_FILE" 2>/dev/null || \
    sed -i '' 's|^DATABASE_URL_POSTGRESQL=.*neon|# &|' "$ENV_FILE" 2>/dev/null
    
    # Add or update local database URL
    if grep -q "^DATABASE_URL_POSTGRESQL=" "$ENV_FILE"; then
        # Update existing line
        sed -i.bak 's|^DATABASE_URL_POSTGRESQL=.*|DATABASE_URL_POSTGRESQL="postgresql://postgres:postgres@localhost:5432/loan_admin?schema=public"|' "$ENV_FILE" 2>/dev/null || \
        sed -i '' 's|^DATABASE_URL_POSTGRESQL=.*|DATABASE_URL_POSTGRESQL="postgresql://postgres:postgres@localhost:5432/loan_admin?schema=public"|' "$ENV_FILE" 2>/dev/null
    else
        # Add new line
        echo 'DATABASE_URL_POSTGRESQL="postgresql://postgres:postgres@localhost:5432/loan_admin?schema=public"' >> "$ENV_FILE"
    fi
    
    # Clean up backup file created by sed
    rm -f "$ENV_FILE.bak" 2>/dev/null
    
    echo "✅ Updated .env file to use local PostgreSQL database"
    echo ""
    echo "Current DATABASE_URL_POSTGRESQL:"
    grep "^DATABASE_URL_POSTGRESQL=" "$ENV_FILE" | head -1
else
    echo "❌ .env file not found. Creating new one..."
    cat > "$ENV_FILE" << 'ENVEOF'
DATABASE_URL_POSTGRESQL="postgresql://postgres:postgres@localhost:5432/loan_admin?schema=public"
JWT_SECRET="your-super-secret-jwt-key-change-in-production"
JWT_EXPIRES_IN="7d"
NODE_ENV=development
PORT=3000
ENVEOF
    echo "✅ Created new .env file with local database configuration"
fi
