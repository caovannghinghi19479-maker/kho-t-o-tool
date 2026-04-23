import { EventEmitter } from 'node:events';
import { prisma } from './prisma';

export interface QueueJobPayload {
  jobId: string;
  runner: () => Promise<{ resultUrl?: string; message: string }>;
}

class JobQueue extends EventEmitter {
  private queue: QueueJobPayload[] = [];
  private running = false;

  enqueue(job: QueueJobPayload): void {
    this.queue.push(job);
    this.emit('queued', { jobId: job.jobId });
    void this.process();
  }

  private async process(): Promise<void> {
    if (this.running) {
      return;
    }

    const next = this.queue.shift();
    if (!next) {
      return;
    }

    this.running = true;
    this.emit('progress', { jobId: next.jobId, status: 'running', message: 'Job started.' });

    await prisma.job.update({ where: { id: next.jobId }, data: { status: 'running' } });

    try {
      const result = await next.runner();
      await prisma.job.update({ where: { id: next.jobId }, data: { status: 'completed', resultUrl: result.resultUrl } });
      this.emit('progress', { jobId: next.jobId, status: 'completed', message: result.message, resultUrl: result.resultUrl });
    } catch (error) {
      await prisma.job.update({ where: { id: next.jobId }, data: { status: 'failed' } });
      this.emit('progress', { jobId: next.jobId, status: 'failed', message: (error as Error).message });
    } finally {
      this.running = false;
      void this.process();
    }
  }
}

export const jobQueue = new JobQueue();
