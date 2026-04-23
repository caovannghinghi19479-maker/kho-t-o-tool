import { Router } from 'express';
import { z } from 'zod';
import { generateDescription } from '../services/youtube/descriptionGenerator';
import { planThumbnail } from '../services/youtube/thumbnailPlanner';
import { generateSeoTitle } from '../services/youtube/titleGenerator';

const router = Router();

router.post('/title', async (req, res) => {
  const parsed = z.object({ topic: z.string().min(1), hook: z.string().default('Must-watch') }).safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: parsed.error.flatten() });
  return res.json({ title: await generateSeoTitle(parsed.data.topic, parsed.data.hook) });
});

router.post('/description', (req, res) => {
  const parsed = z.object({ title: z.string().min(1), script: z.string().min(1) }).safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: parsed.error.flatten() });
  return res.json({ description: generateDescription(parsed.data.title, parsed.data.script) });
});

router.post('/thumbnail-plan', (req, res) => {
  const parsed = z.object({ keyframes: z.array(z.string()), topic: z.string().min(1) }).safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: parsed.error.flatten() });
  return res.json({ plan: planThumbnail(parsed.data.keyframes, parsed.data.topic) });
});

export default router;
