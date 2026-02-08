import Redis from 'ioredis';
import { getRedisConnectionOptions } from '../config/env.js';

async function clearRedis() {
  const options = getRedisConnectionOptions();
  console.log(`Connecting to Redis at ${options.host}:${options.port}...`);
  
  const redis = new Redis({
    host: options.host,
    port: options.port,
    password: options.password,
  });

  console.log('Connected. Flushing all databases...');
  
  await redis.flushall();
  console.log('✅ Redis cleared.');
  
  await redis.quit();
}

clearRedis().catch(console.error);
