# 🔧 Backend - Web Scraper AI API

Express.js backend service that scrapes websites and answers questions using Google Gemini AI.

## ✨ Features

- **🌐 Web Scraping**
  - Playwright for JavaScript-heavy sites (local development)
  - Cheerio + Axios for static sites (production/lightweight)
  - Smart content extraction and cleaning

- **🤖 AI Integration**
  - Google Gemini 2.0 Flash for fast question answering
  - Context-aware responses based on scraped content
  - Configurable AI models and parameters

- **⚡ Background Job Processing**
  - BullMQ for async task queue management
  - Redis-based job persistence
  - Automatic retry on failures
  - Real-time task status updates

- **💾 Data Management**
  - PostgreSQL database with Drizzle ORM
  - TypeScript schema definitions
  - Automatic migrations
  - Task history and tracking

- **🔒 Security & Validation**
  - URL validation and sanitization
  - Private IP address blocking
  - Content length limits
  - Input validation with error handling

- **🐳 Docker Support**
  - Multi-stage production builds
  - Health checks and auto-restart
  - Optimized for containerized deployment

## 📁 Directory Structure

```
backend/
├── src/
│   ├── index.ts                 # Express app entry point
│   ├── controllers/             # Request handlers
│   │   └── tasks.controller.ts  # Task CRUD operations
│   ├── routes/                  # API route definitions
│   │   └── tasks.route.ts       # Task endpoints
│   ├── services/                # Business logic
│   │   ├── scraper.service.ts   # Web scraping (Playwright/Cheerio)
│   │   └── ai.service.ts        # Gemini AI integration
│   ├── queue/                   # Background job processing
│   │   ├── redis.ts             # Redis connection
│   │   ├── scrapeQueue.ts       # BullMQ queue setup
│   │   └── scrapeWorker.ts      # Job processor
│   ├── db/                      # Database layer
│   │   ├── index.ts             # Drizzle DB connection
│   │   └── schema.ts            # Database schema (tasks table)
│   ├── middleware/              # Express middleware
│   │   └── errorHandler.ts     # Global error handling
│   └── types/                   # TypeScript definitions
│       └── index.ts             # Shared types
├── drizzle/                     # Database migrations
│   ├── 0000_tidy_preak.sql      # Initial schema
│   └── meta/                    # Migration metadata
├── drizzle.config.ts            # Drizzle ORM configuration
├── Dockerfile                   # Production Docker image
├── docker-entrypoint.sh         # Startup script (runs migrations)
├── .dockerignore                # Docker build exclusions
├── .env.example                 # Environment template
├── package.json                 # Dependencies & scripts
├── tsconfig.json                # TypeScript configuration
└── README.md                    # This file
```

## 🔑 Key Technologies

- **Runtime**: Node.js 20 with TypeScript
- **Framework**: Express.js
- **Database**: PostgreSQL 16 with Drizzle ORM
- **Cache/Queue**: Redis 7 with BullMQ
- **AI**: Google Gemini API (@google/generative-ai)
- **Scraping**: Playwright (dev) / Axios + Cheerio (prod)
- **Validation**: Zod for schema validation

## 🌐 API Endpoints

### Route Structure

```
/
├── /health                      # Health check
└── /api
    └── /tasks
        ├── POST   /             # Create new task
        ├── GET    /             # List all tasks (with pagination)
        └── GET    /:id          # Get specific task by ID
```

### **POST** `/api/tasks`
Create a new scraping task

**Request Body:**
```json
{
  "url": "https://example.com",
  "question": "What is this website about?"
}
```

**Response:**
```json
{
  "id": 1,
  "url": "https://example.com",
  "question": "What is this website about?",
  "status": "pending",
  "createdAt": "2025-11-15T10:00:00.000Z"
}
```

### **GET** `/api/tasks`
List all tasks with pagination

**Query Parameters:**
- `limit` (optional) - Number of results per page (default: 10)
- `offset` (optional) - Number of results to skip (default: 0)

**Response:**
```json
{
  "tasks": [
    {
      "id": 1,
      "url": "https://example.com",
      "question": "What is this website about?",
      "status": "completed",
      "aiAnswer": "This website is about...",
      "createdAt": "2025-11-15T10:00:00.000Z",
      "completedAt": "2025-11-15T10:00:30.000Z"
    }
  ],
  "total": 1
}
```

### **GET** `/api/tasks/:id`
Get specific task details with AI answer

**Response:**
```json
{
  "id": 1,
  "url": "https://example.com",
  "question": "What is this website about?",
  "status": "completed",
  "scrapedContent": "Full website content...",
  "aiAnswer": "This website is about...",
  "createdAt": "2025-11-15T10:00:00.000Z",
  "updatedAt": "2025-11-15T10:00:30.000Z",
  "completedAt": "2025-11-15T10:00:30.000Z"
}
```

### **GET** `/health`
Health check endpoint

**Response:**
```json
{
  "status": "ok",
  "timestamp": "2025-11-15T10:00:00.000Z",
  "uptime": 3600
}
```

## 🚀 Getting Started

See the main [README.md](../README.md) in the root directory for setup instructions.

**Quick Start:**
```bash
# Install dependencies
npm install

# Setup environment
cp .env.example .env
# Edit .env with your configuration

# Run migrations
npm run db:push

# Start development server
npm run dev
```

## 📝 Environment Variables

See `.env.example` for all configuration options including:
- `DATABASE_URL` - PostgreSQL connection string
- `REDIS_HOST` / `REDIS_PORT` - Redis connection
- `GEMINI_API_KEY` - Google AI Studio API key
- `USE_PLAYWRIGHT` - Toggle between Playwright/Cheerio
- `MAX_CONTENT_LENGTH` - Content extraction limit

## 🔄 How It Works

1. **User submits task** → POST `/api/tasks` with URL and question
2. **Task created** → Saved to PostgreSQL with status "pending"
3. **Job queued** → Task added to BullMQ queue for background processing
4. **Worker processes** → Scrapes website, sends to Gemini AI, saves answer
5. **User polls** → GET `/api/tasks/:id` to check status and get result
6. **Complete** → Task status updated to "completed" with AI answer

## 📊 Database Schema

**tasks** table:
- `id` - Auto-increment primary key
- `url` - Website URL to scrape
- `question` - User's question
- `status` - pending | processing | completed | failed
- `scrapedContent` - Extracted website text
- `aiAnswer` - Gemini AI response
- `errorMessage` - Error details if failed
- `createdAt` - Timestamp
- `updatedAt` - Last update timestamp
- `completedAt` - Completion timestamp

## 🐛 Troubleshooting

**Database connection issues:**
- Ensure PostgreSQL is running
- Check `DATABASE_URL` in `.env`
- For local dev, use `localhost` not `postgres`

**Redis connection errors:**
- Verify Redis is running
- Check `REDIS_HOST` in `.env`
- For local dev, use `localhost` not `redis`

**Scraping failures:**
- Check if website blocks bots
- Try enabling Playwright: `USE_PLAYWRIGHT=true`
- Verify website is accessible
