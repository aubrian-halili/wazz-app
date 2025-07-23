#!/bin/bash

# Deploy database migrations for Wazz messaging app
set -e

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

echo -e "${GREEN}🗃️  Deploying Wazz database migrations...${NC}"

# Check if DATABASE_URL is set
if [ -z "$DATABASE_URL" ]; then
    echo -e "${RED}❌ DATABASE_URL environment variable is not set${NC}"
    echo "Please set DATABASE_URL before running migrations"
    exit 1
fi

# Check if Prisma CLI is available
if ! command -v prisma &> /dev/null; then
    echo -e "${YELLOW}📦 Installing Prisma CLI...${NC}"
    npm install -g prisma
fi

echo -e "${YELLOW}🔧 Generating Prisma client...${NC}"
# Generate Prisma client
npx prisma generate

echo -e "${YELLOW}🚀 Running database migrations...${NC}"
# Run migrations (this will create tables if they don't exist)
npx prisma migrate deploy

# Check if we should seed the database
if [ "$SEED_DATABASE" = "true" ]; then
    echo -e "${YELLOW}🌱 Seeding database...${NC}"
    npx prisma db seed
fi

echo -e "${GREEN}✅ Database setup complete!${NC}"

# Show database info
echo -e "${GREEN}📊 Database connection info:${NC}"
npx prisma db pull --print
