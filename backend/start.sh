#!/bin/sh

ADMIN_EMAIL="${ADMIN_EMAIL:-admin@admin.com}"
ADMIN_PASSWORD="${ADMIN_PASSWORD:-admin}"

# Run migrations and start server
echo "Running database migrations..."
yarn medusa db:migrate

echo "Seeding database..."
yarn seed || echo "Seeding failed, continuing..."

echo "Creating admin user (${ADMIN_EMAIL})..."
yarn medusa user --email "$ADMIN_EMAIL" --password "$ADMIN_PASSWORD" || echo "Admin user already exists or creation failed, continuing..."

echo "Starting Medusa development server..."
yarn dev
