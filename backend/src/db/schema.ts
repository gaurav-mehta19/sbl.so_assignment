import { pgTable, serial, text, timestamp, varchar } from 'drizzle-orm/pg-core';

export const tasks = pgTable('tasks', {
  id: serial('id').primaryKey(),
  url: varchar('url', { length: 2048 }).notNull(),
  question: text('question').notNull(),
  status: varchar('status', { length: 50 }).notNull().default('pending'), // pending, processing, completed, failed
  scrapedContent: text('scraped_content'),
  aiAnswer: text('ai_answer'),
  errorMessage: text('error_message'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
  completedAt: timestamp('completed_at'),
});

export type Task = typeof tasks.$inferSelect;
export type NewTask = typeof tasks.$inferInsert;
