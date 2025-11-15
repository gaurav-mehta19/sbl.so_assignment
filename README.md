# 🚀 Web Scraper AI - Full Stack Application

This repository contains both frontend and backend for the Web Scraper AI application - an intelligent tool that scrapes websites and answers questions using AI.

## 📦 What's Inside

- **Frontend**: Next.js 16 + React 19 + Tailwind CSS 4 + Zustand
- **Backend**: Express + TypeScript + PostgreSQL + Redis + BullMQ + Gemini AI
- **Database**: PostgreSQL 16 with Drizzle ORM
- **Queue**: Redis 7 with BullMQ for background jobs
- **Scraping**: Playwright for browser automation

## 🚀 Quick Start (Docker - Recommended)

The easiest way to run the entire application:

```bash
# 1. Clone the repository
git clone https://github.com/gaurav-mehta19/sbl.so_assignment.git
cd sbl.so_assignment

# 2. Run the start script (it will create .env files automatically)
./start.sh

# 3. The script will stop and ask you to add your Gemini API key
# Edit backend/.env and add your key, then run ./start.sh again
# Get your API key from: https://aistudio.google.com/app/apikey
```

The application will be available at:
- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:3001


## 🛠️ Manual Setup (Local Development)

### Backend Setup

```bash
cd backend
npm install

# Configure .env file with your settings
cp .env.example .env
# Edit .env and add your Gemini API key

# Start PostgreSQL and Redis (via Docker)
docker compose up -d postgres redis

# Run migrations
npm run db:push

# Start development server
npm run dev
```

Backend will run on http://localhost:3001

### Frontend Setup

```bash
cd frontend
npm install

# Configure .env file
echo "NEXT_PUBLIC_API_URL=http://localhost:3001" > .env

# Start development server
npm run dev
```

Frontend will run on http://localhost:3000

## 🏗️ Architecture

```
Frontend (Next.js) ──HTTP──> Backend (Express)
                                │
                                ├──> PostgreSQL (Data Storage)
                                ├──> Redis (Job Queue)
                                └──> Gemini AI (Question Answering)
```

## 📝 Important Notes

- **Playwright vs Cheerio**: For best scraping results, run locally with Playwright enabled. The deployed version uses Cheerio due to hosting limitations.
- **Cold Starts**: The free-tier backend on Render may take extra time on first request.
- **Local Development**: Recommended for testing complex websites that require JavaScript rendering.

## 🌐 Live Deployment

- **Frontend**: https://sbl-so-assignment-frontend.vercel.app
- **Backend**: https://sbl-so-assignment.onrender.com

## 📚 Documentation

- [Docker Setup Guide](./DOCKER.md) - Complete Docker orchestration guide
- [Backend README](./backend/README.md) - Backend API documentation
- [Frontend README](./frontend/README.md) - Frontend setup and usage

## 🧪 Testing

```bash
# Test backend health
curl http://localhost:3001/health

# Test frontend
curl http://localhost:3000
```

## 🛑 Stopping Services

```bash
# Docker setup
docker compose down

# Manual setup
# Stop backend (Ctrl+C)
# Stop frontend (Ctrl+C)
# Stop services: docker-compose down
```

## 📄 License

MIT
