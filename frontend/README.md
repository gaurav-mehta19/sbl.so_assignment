# 🎨 Frontend - Web Scraper AI

Next.js 16 frontend application for the Web Scraper AI platform. Users can submit websites and questions, then get AI-powered answers.

## ✨ Features

- **🎯 Modern UI/UX**
  - Clean, responsive design with Tailwind CSS 4
  - Custom color palette (Primary Blue, Accent Yellow, Success Green)
  - Smooth animations with Framer Motion
  - Toast notifications for user feedback

- **📝 Task Management**
  - Create new scraping tasks with URL and question
  - View all tasks with status indicators
  - Real-time status updates (pending → processing → completed)
  - Detailed task view with markdown-formatted AI answers

- **⚡ State Management**
  - Zustand for lightweight global state
  - Separate stores for forms, tasks, and filters
  - Optimistic UI updates
  - Automatic form clearing on page load

- **🔄 Data Fetching**
  - TanStack React Query for server state
  - Automatic background refetching
  - Loading and error states
  - Cache management

- **🎭 Component Library**
  - Reusable UI components (Button, Card, Input)
  - Custom floating label inputs
  - Status badges with color coding
  - Favicon display for websites
  - Loading skeletons

- **♿ Accessibility**
  - Semantic HTML
  - ARIA labels and roles
  - Keyboard navigation support
  - Screen reader friendly

- **🐳 Docker Ready**
  - Optimized multi-stage builds
  - Standalone output for production
  - Environment-based configuration

## 📁 Directory Structure

```
frontend/
├── app/                         # Next.js App Router
│   ├── layout.tsx               # Root layout with providers
│   ├── page.tsx                 # Home page (task creation)
│   ├── globals.css              # Global styles & CSS variables
│   ├── tasks/                   # Task list route
│   │   └── page.tsx             # All tasks view
│   └── task/                    # Task detail route
│       └── [id]/
│           └── page.tsx         # Single task view
├── components/                  # React components
│   ├── query-provider.tsx       # TanStack Query setup
│   ├── loader.tsx               # Loading spinner
│   └── ui/                      # Reusable UI components
│       ├── button.tsx           # Custom button
│       ├── card.tsx             # Card container
│       ├── input.tsx            # Text input
│       ├── floating-input.tsx   # Floating label input
│       ├── status-badge.tsx     # Task status indicator
│       ├── favicon-display.tsx  # Website favicon
│       ├── skeleton.tsx         # Loading placeholder
│       └── toaster.tsx          # Toast notifications
├── lib/                         # Utilities & logic
│   ├── api.ts                   # API client (Axios)
│   ├── utils.ts                 # Helper functions
│   ├── design-system.ts         # Design tokens & colors
│   └── store/                   # Zustand state management
│       ├── atoms.ts             # Store definitions
│       ├── hooks.ts             # Custom store hooks
│       ├── selectors.ts         # Derived state
│       └── index.ts             # Store exports
├── public/                      # Static assets
│   └── favicon.ico              # Site favicon
├── Dockerfile                   # Production Docker image
├── .dockerignore                # Docker build exclusions
├── .env                         # Environment variables
├── .env.example                 # Environment template
├── next.config.ts               # Next.js configuration
├── tailwind.config.ts           # Tailwind CSS setup
├── tsconfig.json                # TypeScript configuration
├── components.json              # shadcn/ui config
├── package.json                 # Dependencies & scripts
└── README.md                    # This file
```

## 🔑 Key Technologies

- **Framework**: Next.js 16 with React 19
- **Styling**: Tailwind CSS 4 with custom design system
- **State Management**: Zustand 5
- **Data Fetching**: TanStack React Query 5
- **Animations**: Framer Motion
- **UI Components**: Custom + shadcn/ui patterns
- **Type Safety**: TypeScript 5
- **API Client**: Axios
- **Notifications**: Sonner (toast library)

## 🎨 Design System

### Color Palette
- **Primary Blue**: `#1F6FEB` - Main brand color
- **Accent Yellow**: `#FFD43B` - Highlights and CTAs
- **Positive Green**: `#4CAF50` - Success states
- **Background Gray**: `#F5F7FA` - Page backgrounds
- **Card White**: `#FFFFFF` - Content cards
- **Dark Text**: `#1A1A1A` - Primary text

### Status Colors
- **Pending**: Blue (`#1F6FEB`)
- **Processing**: Yellow (`#FFD43B`)
- **Completed**: Green (`#4CAF50`)
- **Failed**: Red (`#EF4444`)

## 🗂️ State Management (Zustand)

### Stores

**useTaskFormStore**
- Manages task creation form state (URL, question)
- Actions: `setUrl`, `setQuestion`, `clearForm`

**useCurrentTaskStore**
- Stores currently viewed task
- Actions: `setCurrentTask`, `clearCurrentTask`

**useTasksListStore**
- Manages task list and filters
- Actions: `setTasks`, `addTask`, `updateTask`, `setFilter`

**useTaskCreationStore**
- Tracks task creation loading state
- Actions: `setLoading`, `setError`, `reset`

## 🚀 Getting Started

See the main [README.md](../README.md) in the root directory for setup instructions.

**Quick Start:**
```bash
# Install dependencies
npm install

# Setup environment
cp .env.example .env
# Edit .env with API URL

# Start development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

## 📝 Environment Variables

```bash
# Backend API URL
NEXT_PUBLIC_API_URL=http://localhost:3001

# For production
# NEXT_PUBLIC_API_URL=https://your-api-domain.com
```

> **Note**: `NEXT_PUBLIC_` prefix makes variables available in the browser.

## 📄 Pages

### Home (`/`)
- Task creation form
- Floating label inputs for URL and question
- Submit to create new scraping task
- Redirects to task detail on success

### Tasks List (`/tasks`)
- Grid view of all tasks
- Status filters (All, Pending, Processing, Completed, Failed)
- Task statistics (total, completed, failed)
- Click to view task details

### Task Detail (`/task/[id]`)
- Real-time task status
- Website favicon and URL
- User's question
- AI-generated answer (markdown formatted)
- Auto-refresh every 5 seconds for pending/processing tasks
- Error messages if task failed

## 🎯 User Flow

1. **Create Task** → User enters URL and question on home page
2. **Submit** → Form data sent to backend API
3. **Redirect** → Navigate to task detail page
4. **Polling** → Page auto-refreshes until task completes
5. **Result** → AI answer displayed when ready
6. **Browse** → View all tasks on `/tasks` page

## 🔧 Development

```bash
# Development server with hot reload
npm run dev

# Production build
npm run build

# Start production server
npm start

# Type checking
npm run type-check

# Linting
npm run lint
```

## 🐛 Troubleshooting

**Network errors:**
- Verify backend is running
- Check `NEXT_PUBLIC_API_URL` in `.env`
- Ensure API URL is accessible from browser

**Build errors:**
- Clear `.next` folder: `rm -rf .next`
- Reinstall dependencies: `rm -rf node_modules && npm install`
- Check for TypeScript errors: `npx tsc --noEmit`

**Styling issues:**
- Verify Tailwind CSS is configured correctly
- Check `globals.css` for CSS variable definitions
- Inspect element to see applied classes

## 📱 Responsive Design

- **Mobile**: Single column layout, touch-friendly buttons
- **Tablet**: 2-column grid for task cards
- **Desktop**: 3-column grid, optimized spacing
