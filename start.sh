#!/bin/bash
# Quick start script for the Web Scraper AI application

set -e

echo "🚀 Web Scraper AI - Docker Setup"
echo "================================"
echo ""

# Check if Docker is running
if ! docker info > /dev/null 2>&1; then
    echo "❌ Docker is not running. Please start Docker Desktop first."
    exit 1
fi

echo "✅ Docker is running"
echo ""

# Check if .env files exist
if [ ! -f "backend/.env" ]; then
    echo "⚠️  backend/.env not found"
    echo "📝 Creating backend/.env from template..."
    
    cat > backend/.env << 'EOF'
# Database
DATABASE_URL=postgresql://postgres:postgres@postgres:5432/scraper_db

# Redis
REDIS_HOST=redis
REDIS_PORT=6379
REDIS_PASSWORD=

# Google Gemini AI
GEMINI_API_KEY=your_gemini_api_key_here
GEMINI_MODEL=gemini-2.0-flash-exp

# Server
PORT=3001
NODE_ENV=production

# Scraper Settings
USE_PLAYWRIGHT=false
MAX_CONTENT_LENGTH=50000
EOF
    
    echo "⚠️  Please edit backend/.env and add your GEMINI_API_KEY"
    echo "   Get your key from: https://aistudio.google.com/app/apikey"
    exit 1
fi

if [ ! -f "frontend/.env" ]; then
    echo "⚠️  frontend/.env not found"
    echo "📝 Creating frontend/.env from template..."
    
    cat > frontend/.env << 'EOF'
# Backend API URL (use localhost for browser access from host machine)
NEXT_PUBLIC_API_URL=http://localhost:3001
EOF
fi

echo "✅ Environment files configured"
echo ""

# Check if Gemini API key is set
if grep -q "your_gemini_api_key_here" backend/.env; then
    echo "⚠️  GEMINI_API_KEY not configured in backend/.env"
    echo "📝 Please edit backend/.env and add your Gemini API key"
    echo "   Get your key from: https://aistudio.google.com/app/apikey"
    exit 1
fi

echo "✅ Gemini API key configured"
echo ""

# Stop any running containers
echo "🛑 Stopping any existing containers..."
docker compose down 2>/dev/null || true
echo ""

# Build and start services
echo "🏗️  Building and starting services..."
echo "   This may take a few minutes on first run..."
echo ""

docker compose up --build -d

echo ""
echo "⏳ Waiting for services to be healthy..."
echo ""

# Wait for services to be healthy
max_attempts=60
attempt=0

while [ $attempt -lt $max_attempts ]; do
    attempt=$((attempt + 1))
    
    # Check PostgreSQL
    if docker compose ps postgres | grep -q "healthy"; then
        postgres_healthy=true
    else
        postgres_healthy=false
    fi
    
    # Check Redis
    if docker compose ps redis | grep -q "healthy"; then
        redis_healthy=true
    else
        redis_healthy=false
    fi
    
    # Check Backend
    if docker compose ps backend | grep -q "healthy"; then
        backend_healthy=true
    else
        backend_healthy=false
    fi
    
    # Check Frontend
    if docker compose ps frontend | grep -q "healthy"; then
        frontend_healthy=true
    else
        frontend_healthy=false
    fi
    
    if [ "$postgres_healthy" = true ] && [ "$redis_healthy" = true ] && [ "$backend_healthy" = true ] && [ "$frontend_healthy" = true ]; then
        echo "✅ All services are healthy!"
        break
    fi
    
    echo "   Attempt $attempt/$max_attempts - Waiting for services..."
    sleep 2
done

if [ $attempt -eq $max_attempts ]; then
    echo "⚠️  Services took longer than expected to start"
    echo "   Check logs with: docker compose logs"
fi

echo ""
echo "🎉 Application is ready!"
echo ""
echo "📍 Access the application:"
echo "   Frontend:  http://localhost:3000"
echo "   Backend:   http://localhost:3001"
echo "   PostgreSQL: localhost:5432"
echo "   Redis:     localhost:6379"
echo ""
echo "📊 View logs:"
echo "   All:      docker compose logs -f"
echo "   Frontend: docker compose logs -f frontend"
echo "   Backend:  docker compose logs -f backend"
echo ""
echo "🛑 Stop application:"
echo "   docker compose down"
echo ""
