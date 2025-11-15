#!/bin/bash
# Render build script

echo "Installing dependencies..."
npm install

echo "Building TypeScript..."
npm run build

echo "Running database migrations..."
npm run db:push

echo "Build completed!"
echo "Note: Using HTTP scraper (axios + cheerio) - no browser installation needed"
