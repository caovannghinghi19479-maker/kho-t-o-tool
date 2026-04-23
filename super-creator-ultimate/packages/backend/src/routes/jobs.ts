import { Router } from 'express';
import { jobQueue } from '../lib/jobQueue';
import { prisma } from '../lib/prisma';

const router = Router();

router.get('/', async (_req, res) => {
  const jobs = await prisma.job.findMany({ include: { profile: true }, orderBy: { createdAt: 'desc' } });
  res.json(jobs);
});

router.get('/:id/stream', async (req, res) => {
  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache');
  res.setHeader('Connection', 'keep-alive');

  const send = (payload: unknown): void => {
    res.write(`data: ${JSON.stringify(payload)}\n\n`);
  };

  const initial = await prisma.job.findUnique({ where: { id: req.params.id } });
  send({ type: 'initial', payload: initial });

  const listener = (event: { jobId: string; status: string; message: string; resultUrl?: string }) => {
    if (event.jobId === req.params.id) {
      send({ type: 'progress', payload: event });
    }
  };

  jobQueue.on('progress', listener);

  const heartbeat = setInterval(() => send({ type: 'heartbeat', at: Date.now() }), 15000);

  req.on('close', () => {
    clearInterval(heartbeat);
    jobQueue.off('progress', listener);
    res.end();
  });
});

export default router;
