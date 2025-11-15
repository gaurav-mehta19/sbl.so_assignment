# 🚀 Web Scraper & AI Backend API

Backend service that scrapes websites and answers questions using AI.

## ✨ Features

- 🌐 **Web Scraping** - Playwright-based browser automation
- 🤖 **AI Integration** - Google Gemini API for answering questions
- ⚡ **Background Jobs** - BullMQ with Redis for async processing
- 💾 **Database** - PostgreSQL with Drizzle ORM
- 📦 **TypeScript** - Full type safety
- 🔒 **Security** - URL validation, input sanitization, private IP blocking
- 🐳 **Docker** - Full containerization support

## 📋 Prerequisites

**For Docker:**
- Docker Desktop ([macOS](https://www.docker.com/products/docker-desktop/) | [Windows](https://www.docker.com/products/docker-desktop/) | [Linux](https://docs.docker.com/engine/install/))
- [Gemini API key](https://makersuite.google.com/app/apikey)

**For Local:**
- Node.js 18+, PostgreSQL 12+, Redis 6+
- [Gemini API key](https://makersuite.google.com/app/apikey)

## 🚀 Running Locally

### Option 1: Docker (Recommended)

**Step 1: Prepare Environment**
```bash
cd backend
cp .env.docker .env
```

**Step 2: Edit `.env` file**
```bash
# Open .env and update:
GEMINI_API_KEY=your_actual_api_key_here
```

**Step 3: Start Services**
```bash
docker-compose up
```

✅ Done! Server runs at `http://localhost:3001`

**What Docker Does:**
- Starts PostgreSQL database (port 5432)
- Starts Redis (port 6379)
- Runs database migrations automatically
- Starts backend server (port 3001)

**Useful Docker Commands:**
```bash
docker-compose up          # Start all services (foreground)
docker-compose up -d       # Start in background
docker-compose down        # Stop all services
docker-compose logs -f     # View logs
docker-compose restart     # Restart services
docker-compose up --build  # Rebuild containers
docker-compose down -v     # Clean slate (removes data)
```

---

### Option 2: Manual Local Setup

#### Step 1: Install Dependencies

**macOS:**
```bash
# Install PostgreSQL
brew install postgresql@16
brew services start postgresql@16

# Install Redis
brew install redis
brew services start redis

# Verify installations
psql --version
redis-cli --version
```

**Windows:**
1. Install [PostgreSQL](https://www.postgresql.org/download/windows/)
2. Install [Redis](https://github.com/microsoftarchive/redis/releases) or [Memurai](https://www.memurai.com/)
3. Install [Node.js 18+](https://nodejs.org/)

**Linux (Ubuntu/Debian):**
```bash
# Install PostgreSQL
sudo apt update
sudo apt install postgresql postgresql-contrib
sudo systemctl start postgresql

# Install Redis
sudo apt install redis-server
sudo systemctl start redis-server

# Verify
psql --version
redis-cli --version
```

#### Step 2: Setup Project

```bash
# Navigate to backend
cd backend

# Install Node dependencies
npm install

# Install Playwright browser
npx playwright install chromium

# Copy environment file
cp .env.example .env
```

#### Step 3: Configure Environment

Edit `.env` file with your settings:
```env
DATABASE_URL=postgresql://postgres:your_password@localhost:5432/scraper_db
REDIS_HOST=localhost
REDIS_PORT=6379
GEMINI_API_KEY=your_actual_api_key_here
```

**Note:** You don't need to manually create the database. Just ensure PostgreSQL is running with the correct credentials. Drizzle will automatically create the database and tables when you run the migration command below.

#### Step 4: Initialize Database & Start Server

```bash
# This will create database, tables, and schema automatically
npm run db:push

# Start the server

```bash
# Development (with hot reload)
npm run dev

# Production
npm run build
npm start
```

✅ Server runs at `http://localhost:3001`

## 🔌 API Routes

Base URL: `http://localhost:3001`

### 1. Health Check

**Endpoint:** `GET /`

**Response:**
```json
{
  "message": "Web Scraper & AI API Server",
  "status": "running"
}
```

---

### 2. Create Task

**Endpoint:** `POST /api/tasks`

**Request Headers:**
```
Content-Type: application/json
```

**Request Body:**
```json
{
  "url": "https://example.com",
  "question": "What is this website about?"
}
```

**Validation Rules:**
- `url`: Required, valid HTTP/HTTPS URL, max 2048 chars
- `question`: Required, max 1000 chars
- Private IPs (localhost, 192.168.x.x, 10.x.x.x) are blocked

**Success Response (201):**
```json
{
  "message": "Task created successfully",
  "task": {
    "id": 1,
    "url": "https://example.com",
    "question": "What is this website about?",
    "status": "pending",
    "createdAt": "2025-11-15T10:30:00.000Z"
  }
}
```

**Error Response (400):**
```json
{
  "error": "Invalid URL format"
}
```

**cURL Example:**
```bash
curl -X POST http://localhost:3001/api/tasks \
  -H "Content-Type: application/json" \
  -d '{
    "url": "https://github.com",
    "question": "What is GitHub used for?"
  }'
```

---

### 3. Get Task by ID

**Endpoint:** `GET /api/tasks/:id`

**URL Parameters:**
- `id` (required): Task ID (integer)

**Success Response (200):**
```json
{
  "task": {
    "id": 1,
    "url": "https://example.com",
    "question": "What is this website about?",
    "status": "completed",
    "aiAnswer": "This website is about...",
    "errorMessage": null,
    "createdAt": "2025-11-15T10:30:00.000Z",
    "updatedAt": "2025-11-15T10:30:45.000Z",
    "completedAt": "2025-11-15T10:30:45.000Z"
  }
}
```

**Task Status Values:**
- `pending` - Task created, waiting in queue
- `processing` - Currently scraping website and getting AI answer
- `completed` - Successfully finished
- `failed` - Error occurred (check `errorMessage`)

**Error Response (404):**
```json
{
  "error": "Task not found"
}
```

**cURL Example:**
```bash
curl http://localhost:3001/api/tasks/1
```

---

### 4. Get All Tasks

**Endpoint:** `GET /api/tasks`

**Query Parameters:**
- `limit` (optional): Number of tasks to return (default: 50)
- `offset` (optional): Number of tasks to skip (default: 0)

**Success Response (200):**
```json
{
  "tasks": [
    {
      "id": 1,
      "url": "https://example.com",
      "question": "What is this website about?",
      "status": "completed",
      "aiAnswer": "This website is about...",
      "errorMessage": null,
      "createdAt": "2025-11-15T10:30:00.000Z",
      "updatedAt": "2025-11-15T10:30:45.000Z",
      "completedAt": "2025-11-15T10:30:45.000Z"
    }
  ],
  "pagination": {
    "limit": 50,
    "offset": 0,
    "total": 1
  }
}
```

**cURL Example:**
```bash
# Get first 10 tasks
curl http://localhost:3001/api/tasks?limit=10

# Get next 10 tasks
curl http://localhost:3001/api/tasks?limit=10&offset=10
```

## 📁 Project Structure

```
backend/
├── src/
│   ├── controllers/      # HTTP handlers
│   ├── services/         # Business logic (scraper, AI)
│   ├── queue/           # BullMQ setup & worker
│   ├── db/              # Database & schema
│   ├── routes/          # API routes
│   ├── middleware/      # Express middleware
│   └── index.ts         # Entry point
├── drizzle/             # Database migrations
├── .env.example         # Local env template
├── .env.docker          # Docker env template
├── docker-compose.yml   # Docker orchestration
├── Dockerfile           # Container image
└── package.json
```

## 🗄️ Database Schema

```sql
CREATE TABLE tasks (
  id              SERIAL PRIMARY KEY,
  url             VARCHAR(2048) NOT NULL,
  question        TEXT NOT NULL,
  status          VARCHAR(50) DEFAULT 'pending',
  scraped_content TEXT,
  ai_answer       TEXT,
  error_message   TEXT,
  created_at      TIMESTAMP DEFAULT NOW(),
  updated_at      TIMESTAMP DEFAULT NOW(),
  completed_at    TIMESTAMP
);
```

**Status Flow:** `pending` → `processing` → `completed`/`failed`

## 🔧 Available Scripts

```bash
npm run dev        # Start dev server (hot reload)
npm run build      # Build for production
npm start          # Start production server
npm run db:push    # Push schema to database
npm run db:studio  # Open database browser
```

## 🌐 Environment Variables

```env
# Server
PORT=3001
NODE_ENV=development

# Database
DATABASE_URL=postgresql://user:pass@localhost:5432/scraper_db

# Redis
REDIS_HOST=localhost
REDIS_PORT=6379

# AI
GEMINI_API_KEY=your_key_here
GEMINI_MODEL=gemini-2.0-flash-exp

# Optional
MAX_CONTENT_LENGTH=50000
FRONTEND_URL=http://localhost:3000
```

## 🐛 Troubleshooting

**Port already in use:**
```bash
lsof -i :3001  # Check what's using port 3001
# Kill the process or change PORT in .env
```

**Database connection failed:**
```bash
# Ensure PostgreSQL is running
brew services list              # macOS
sudo systemctl status postgresql # Linux
```

**Redis connection refused:**
```bash
brew services start redis       # macOS
sudo systemctl start redis      # Linux
```

**Playwright browser not found:**
```bash
npx playwright install chromium
```

**Docker issues:**
```bash
# Restart Docker Desktop
# Or clean slate:
docker-compose down -v && docker-compose up
```
