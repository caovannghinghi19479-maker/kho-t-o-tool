import { Router } from 'express';
import { z } from 'zod';
import { prisma } from '../lib/prisma';
import { jobQueue } from '../lib/jobQueue';
import { runGeminiInternal } from '../services/geminiInternalService';
import { runGrokAutomation } from '../services/grokService';
import { runVeoGeneration } from '../services/veoService';

const router = Router();

const payloadSchema = z.object({
  profileId: z.string().min(1),
  prompt: z.string().min(1),
  type: z.enum(['text2video', 'image2video', 'text2image']),
  veoUrl: z.string().url().optional()
});

const createJob = async (platform: string, payload: z.infer<typeof payloadSchema>) =>
  prisma.job.create({
    data: {
      type: payload.type,
      platform,
      prompt: payload.prompt,
      status: 'pending',
      profileId: payload.profileId
    }
  });

router.post('/grok/text2image', async (req, res) => {
  const parsed = payloadSchema.safeParse({ ...req.body, type: 'text2image' });
  if (!parsed.success) return res.status(400).json({ error: parsed.error.flatten() });

  const job = await createJob('Grok', parsed.data);
  jobQueue.enqueue({ jobId: job.id, runner: () => runGrokAutomation({ prompt: parsed.data.prompt }) });
  res.status(202).json(job);
});

router.post('/grok/image2video', async (req, res) => {
  const parsed = payloadSchema.safeParse({ ...req.body, type: 'image2video' });
  if (!parsed.success) return res.status(400).json({ error: parsed.error.flatten() });

  const job = await createJob('Grok', parsed.data);
  jobQueue.enqueue({ jobId: job.id, runner: () => runGrokAutomation({ prompt: parsed.data.prompt }) });
  res.status(202).json(job);
});

router.post('/veo/generate', async (req, res) => {
  const parsed = payloadSchema.safeParse({ ...req.body, type: 'text2video' });
  if (!parsed.success) return res.status(400).json({ error: parsed.error.flatten() });

  const job = await createJob('Veo3', parsed.data);
  jobQueue.enqueue({
    jobId: job.id,
    runner: () => runVeoGeneration({ prompt: parsed.data.prompt, veoUrl: parsed.data.veoUrl })
  });
  res.status(202).json(job);
});

router.post('/gemini/internal', async (req, res) => {
  const parsed = payloadSchema.safeParse({ ...req.body, type: 'text2image' });
  if (!parsed.success) return res.status(400).json({ error: parsed.error.flatten() });

  const job = await createJob('Gemini', parsed.data);
  jobQueue.enqueue({ jobId: job.id, runner: () => runGeminiInternal({ prompt: parsed.data.prompt }) });
  res.status(202).json(job);
});

export default router;
