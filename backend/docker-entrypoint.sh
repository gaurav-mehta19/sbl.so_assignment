#!/bin/sh
set -e

echo "🔄 Running database migrations..."
npm run db:push

echo "✅ Migrations complete. Starting server..."
exec "$@"
