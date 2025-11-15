import { Worker, Job } from 'bullmq';
import { redisConnection } from './redis';
import { ScrapeTaskData } from './scrapeQueue';
import { scrapeWebsite } from '../services/scraper.service';
import { getAIAnswer } from '../services/ai.service';
import { db } from '../db';
import { tasks } from '../db/schema';
import { eq } from 'drizzle-orm';

export const scrapeWorker = new Worker<ScrapeTaskData>(
  'scrape-tasks',
  async (job: Job<ScrapeTaskData>) => {
    const { taskId, url, question } = job.data;

    console.log(`Processing task ${taskId}: Scraping ${url}`);

    try {
      // Update status to processing
      await db
        .update(tasks)
        .set({ status: 'processing', updatedAt: new Date() })
        .where(eq(tasks.id, taskId));

      // Step 1: Scrape the website
      console.log(`Scraping website: ${url}`);
      const scrapedContent = await scrapeWebsite(url);

      // Update with scraped content
      await db
        .update(tasks)
        .set({ scrapedContent, updatedAt: new Date() })
        .where(eq(tasks.id, taskId));

      // Step 2: Get AI answer
      console.log(`Getting AI answer for task ${taskId}`);
      const aiAnswer = await getAIAnswer(scrapedContent, question);

      // Update with final result
      await db
        .update(tasks)
        .set({
          aiAnswer,
          status: 'completed',
          completedAt: new Date(),
          updatedAt: new Date(),
        })
        .where(eq(tasks.id, taskId));

      console.log(`Task ${taskId} completed successfully`);
      return { success: true, taskId };
    } catch (error) {
      console.error(`Error processing task ${taskId}:`, error);

      // Update with error
      await db
        .update(tasks)
        .set({
          status: 'failed',
          errorMessage: error instanceof Error ? error.message : 'Unknown error',
          updatedAt: new Date(),
        })
        .where(eq(tasks.id, taskId));

      throw error;
    }
  },
  {
    connection: redisConnection,
    concurrency: 5, // Process up to 5 jobs concurrently
  }
);

scrapeWorker.on('completed', (job) => {
  console.log(`Job ${job.id} completed successfully`);
});

scrapeWorker.on('failed', (job, err) => {
  console.error(`Job ${job?.id} failed with error:`, err.message);
});
