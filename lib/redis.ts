// lib/redis.ts
import { Redis } from '@upstash/redis'

// Configure Upstash Redis client
export const redis = new Redis({
  url: process.env.UPSTASH_REDIS_URL || '',
  token: process.env.UPSTASH_REDIS_TOKEN || '',
})