import { Queue } from 'bullmq';
import { getRedisConnectionOptions } from '../config/env.js';
import { logger } from '../lib/logger.js';

async function debugPipeline() {
  console.log('🔍 Debugging Pipeline queues...\n');

  const queues = ['crawl', 'normalize', 'embed', 'analyze'];
  const connection = getRedisConnectionOptions();

  for (const queueName of queues) {
    const queue = new Queue(queueName, { connection });
    
    const counts = await queue.getJobCounts();
    console.log(`📂 Queue: ${queueName}`);
    console.log(`   - Active: ${counts.active}`);
    console.log(`   - Waiting: ${counts.waiting}`);
    console.log(`   - Completed: ${counts.completed}`);
    console.log(`   - Failed: ${counts.failed}`);
    console.log(`   - Delayed: ${counts.delayed}`);
    
    if (counts.failed > 0) {
      const failed = await queue.getFailed(0, 5);
      console.log('   ❌ Recent Failures:');
      failed.forEach(job => {
        console.log(`      - Job ${job.id}: ${job.failedReason}`);
        if (job.stacktrace.length > 0) {
           console.log(`        Stack: ${job.stacktrace[0]}`);
        }
      });
    }

    if (counts.active > 0) {
      const active = await queue.getActive(0, 5);
      console.log('   🏃 Active Jobs:');
      active.forEach(job => {
        console.log(`      - Job ${job.id}: ${JSON.stringify(job.data)}`);
      });
    }

    await queue.close();
    console.log('');
  }
}

debugPipeline().catch(console.error);
