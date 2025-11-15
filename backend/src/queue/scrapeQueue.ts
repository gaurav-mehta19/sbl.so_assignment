import { Queue } from 'bullmq';
import { redisConnection } from './redis';

export interface ScrapeTaskData {
  taskId: number;
  url: string;
  question: string;
}

export const scrapeQueue = new Queue<ScrapeTaskData>('scrape-tasks', {
  connection: redisConnection,
  defaultJobOptions: {
    attempts: 3,
    backoff: {
      type: 'exponential',
      delay: 2000,
    },
    removeOnComplete: {
      count: 100, // Keep last 100 completed jobs
      age: 24 * 3600, // Keep completed jobs for 24 hours
    },
    removeOnFail: {
      age: 7 * 24 * 3600, // Keep failed jobs for 7 days
    },
  },
});
