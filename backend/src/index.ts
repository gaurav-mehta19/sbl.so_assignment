// Load environment variables FIRST before any other imports
import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import cors from 'cors';
import tasksRouter from './routes/tasks.route';
import { errorHandler } from './middleware/errorHandler';

const app = express();
const PORT = process.env.PORT || 3001;

// Initialize worker after dotenv is loaded
import './queue/scrapeWorker';

// Middleware
app.use(express.json());

// CORS configuration - allow all origins
app.use(cors({
  origin: '*',
  credentials: false,
}));

// Routes
app.get('/', (req, res) => {
  res.json({ 
    message: 'Web Scraper & AI API Server',
    status: 'running',
  });
});

// Health check endpoint for Docker
app.get('/health', (req, res) => {
  res.status(200).json({ 
    status: 'healthy',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
  });
});

app.use('/api/tasks', tasksRouter);

// Error handling middleware
app.use(errorHandler);

// Start server
app.listen(PORT, () => {
  console.log(` Server is running on port ${PORT}`);
  console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
});