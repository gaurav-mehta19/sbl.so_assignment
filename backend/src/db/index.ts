import { drizzle } from 'drizzle-orm/node-postgres';
import { Pool } from 'pg';
import * as schema from './schema';
import dotenv from 'dotenv';

// Ensure dotenv is loaded (fallback if not loaded in index.ts)
dotenv.config();

if (!process.env.DATABASE_URL) {
  throw new Error('DATABASE_URL environment variable is not set');
}

console.log('🔧 Database Configuration:', {
  url: process.env.DATABASE_URL?.replace(/:[^:@]+@/, ':****@'), // Hide password
});

// Determine SSL configuration
// Disable SSL for local Docker (hostname: postgres or localhost)
// Enable SSL for remote production databases
const isLocalDocker = process.env.DATABASE_URL?.includes('@postgres:') || 
                      process.env.DATABASE_URL?.includes('@localhost:');

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: isLocalDocker ? false : { rejectUnauthorized: false },
});

export const db = drizzle(pool, { schema });
