import { Request, Response } from 'express';
import { db } from '../db';
import { tasks } from '../db/schema';
import { scrapeQueue } from '../queue/scrapeQueue';
import { eq, desc } from 'drizzle-orm';

export const createTask = async (req: Request, res: Response) => {
  try {
    const { url, question } = req.body;

    // Validation
    if (!url || !question) {
      return res.status(400).json({
        error: 'URL and question are required',
      });
    }

    // Sanitize and validate inputs
    const sanitizedUrl = String(url).trim();
    const sanitizedQuestion = String(question).trim();

    // Check if inputs are empty after sanitization
    if (!sanitizedUrl || !sanitizedQuestion) {
      return res.status(400).json({
        error: 'URL and question cannot be empty',
      });
    }

    // Validate question length
    if (sanitizedQuestion.length > 1000) {
      return res.status(400).json({
        error: 'Question is too long (max 1000 characters)',
      });
    }

    // Validate URL format and protocol
    let parsedUrl;
    try {
      parsedUrl = new URL(sanitizedUrl);
      if (!['http:', 'https:'].includes(parsedUrl.protocol)) {
        return res.status(400).json({
          error: 'Only HTTP and HTTPS protocols are allowed',
        });
      }
    } catch {
      return res.status(400).json({
        error: 'Invalid URL format',
      });
    }

    // Block localhost and private IPs for security
    const hostname = parsedUrl.hostname.toLowerCase();
    if (
      hostname === 'localhost' ||
      hostname === '127.0.0.1' ||
      hostname.startsWith('192.168.') ||
      hostname.startsWith('10.') ||
      hostname.startsWith('172.')
    ) {
      return res.status(400).json({
        error: 'Local and private network URLs are not allowed',
      });
    }

    // Create task in database with sanitized inputs
    const [task] = await db
      .insert(tasks)
      .values({
        url: sanitizedUrl,
        question: sanitizedQuestion,
        status: 'pending',
      })
      .returning();

    // Add job to queue
    await scrapeQueue.add('scrape-task', {
      taskId: task.id,
      url: task.url,
      question: task.question,
    });

    res.status(201).json({
      message: 'Task created successfully',
      task: {
        id: task.id,
        url: task.url,
        question: task.question,
        status: task.status,
        createdAt: task.createdAt,
      },
    });
  } catch (error) {
    console.error('Error creating task:', error);
    res.status(500).json({
      error: 'Failed to create task',
      message: error instanceof Error ? error.message : 'Unknown error',
    });
  }
};

export const getTask = async (req: Request, res: Response) => {
  try {
    const taskId = parseInt(req.params.id);

    if (isNaN(taskId)) {
      return res.status(400).json({
        error: 'Invalid task ID',
      });
    }

    const [task] = await db
      .select()
      .from(tasks)
      .where(eq(tasks.id, taskId))
      .limit(1);

    if (!task) {
      return res.status(404).json({
        error: 'Task not found',
      });
    }

    res.json({
      task: {
        id: task.id,
        url: task.url,
        question: task.question,
        status: task.status,
        aiAnswer: task.aiAnswer,
        errorMessage: task.errorMessage,
        createdAt: task.createdAt,
        updatedAt: task.updatedAt,
        completedAt: task.completedAt,
      },
    });
  } catch (error) {
    console.error('Error fetching task:', error);
    res.status(500).json({
      error: 'Failed to fetch task',
      message: error instanceof Error ? error.message : 'Unknown error',
    });
  }
};

export const getAllTasks = async (req: Request, res: Response) => {
  try {
    const limit = parseInt(req.query.limit as string) || 50;
    const offset = parseInt(req.query.offset as string) || 0;

    const allTasks = await db
      .select()
      .from(tasks)
      .orderBy(desc(tasks.createdAt))
      .limit(limit)
      .offset(offset);

    res.json({
      tasks: allTasks.map((task) => ({
        id: task.id,
        url: task.url,
        question: task.question,
        status: task.status,
        aiAnswer: task.aiAnswer,
        errorMessage: task.errorMessage,
        createdAt: task.createdAt,
        updatedAt: task.updatedAt,
        completedAt: task.completedAt,
      })),
      pagination: {
        limit,
        offset,
        total: allTasks.length,
      },
    });
  } catch (error) {
    console.error('Error fetching tasks:', error);
    res.status(500).json({
      error: 'Failed to fetch tasks',
      message: error instanceof Error ? error.message : 'Unknown error',
    });
  }
};
