#!/bin/bash

# Setup script for Docker deployment
echo "🚀 Setting up Web Scraper Backend with Docker..."

# Check if Docker is installed
if ! command -v docker &> /dev/null; then
    echo "❌ Docker is not installed. Please install Docker Desktop for Mac first."
    echo "   Download from: https://www.docker.com/products/docker-desktop/"
    exit 1
fi

# Check if Docker is running
if ! docker info &> /dev/null; then
    echo "❌ Docker is not running. Please start Docker Desktop."
    exit 1
fi

echo "✅ Docker is installed and running"

# Create .env file if it doesn't exist
if [ ! -f .env ]; then
    echo "📝 Creating .env file..."
    cp .env.docker .env
    echo "✅ .env file created"
    
    # Prompt for Gemini API key
    echo ""
    echo "🔑 You need a Google Gemini API key to continue."
    echo "   Get one from: https://makersuite.google.com/app/apikey"
    echo ""
    read -p "Enter your Gemini API key: " api_key
    
    if [ -z "$api_key" ]; then
        echo "⚠️  No API key provided. You can add it later in the .env file."
    else
        # Update the API key in .env
        sed -i '' "s/your_gemini_api_key_here/$api_key/" .env
        echo "✅ API key saved to .env"
    fi
else
    echo "✅ .env file already exists"
fi

echo ""
echo "🐳 Starting Docker containers..."
docker-compose up -d

echo ""
echo "⏳ Waiting for services to be ready..."
sleep 5

echo ""
echo "✅ Setup complete!"
echo ""
echo "📊 Service Status:"
docker-compose ps

echo ""
echo "🎉 Backend is running at: http://localhost:3001"
echo ""
echo "📝 Useful commands:"
echo "   - View logs:        docker-compose logs -f backend"
echo "   - Stop services:    docker-compose down"
echo "   - Restart:          docker-compose restart"
echo "   - Clean reset:      docker-compose down -v && docker-compose up"
echo ""
