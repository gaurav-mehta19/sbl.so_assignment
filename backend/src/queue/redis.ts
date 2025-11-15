import { ConnectionOptions } from 'bullmq';

// Parse REDIS_URL if provided, otherwise use individual env vars
let redisConfig: ConnectionOptions;

if (process.env.REDIS_URL) {
  // Parse URL format: redis://user:pass@host:port or rediss://...
  const url = new URL(process.env.REDIS_URL);
  redisConfig = {
    host: url.hostname,
    port: parseInt(url.port) || 6379,
    password: url.password || undefined,
    username: url.username !== 'default' ? url.username : undefined,
    tls: url.protocol === 'rediss:' ? {} : undefined,
    maxRetriesPerRequest: null,
  };
  console.log('🔧 Redis Configuration (from REDIS_URL):', {
    host: url.hostname,
    port: url.port,
    protocol: url.protocol,
    hasPassword: !!url.password,
  });
} else {
  // Use individual env vars
  redisConfig = {
    host: process.env.REDIS_HOST || 'localhost',
    port: parseInt(process.env.REDIS_PORT || '6379'),
    password: process.env.REDIS_PASSWORD || undefined,
    maxRetriesPerRequest: null,
  };
  console.log('🔧 Redis Configuration (from env vars):', {
    host: process.env.REDIS_HOST || 'localhost',
    port: process.env.REDIS_PORT || '6379',
    hasPassword: !!process.env.REDIS_PASSWORD,
  });
}

export const redisConnection: ConnectionOptions = redisConfig;
