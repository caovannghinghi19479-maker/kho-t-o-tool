import path from 'node:path';
import { Router } from 'express';
import { z } from 'zod';
import { prisma } from '../lib/prisma';

const router = Router();

const createSchema = z.object({
  name: z.string().min(1),
  platform: z.enum(['Veo3', 'Grok', 'Gemini']),
  proxyUrl: z.string().url().optional().or(z.literal('')),
  proxyUser: z.string().optional(),
  proxyPass: z.string().optional()
});

router.get('/', async (_req, res) => {
  const profiles = await prisma.profile.findMany({ orderBy: { createdAt: 'desc' } });
  res.json(profiles);
});

router.post('/', async (req, res) => {
  const parsed = createSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ error: parsed.error.flatten() });
  }

  const userDataDir = path.join(process.cwd(), '.profiles', `${Date.now()}-${parsed.data.name.replace(/\s+/g, '-').toLowerCase()}`);
  const profile = await prisma.profile.create({
    data: {
      name: parsed.data.name,
      platform: parsed.data.platform,
      userDataDir,
      proxyUrl: parsed.data.proxyUrl || null,
      proxyUser: parsed.data.proxyUser || null,
      proxyPass: parsed.data.proxyPass || null
    }
  });

  res.status(201).json(profile);
});

router.post('/:id/cookies', async (req, res) => {
  const payload = z.object({ cookies: z.array(z.any()) }).safeParse(req.body);
  if (!payload.success) {
    return res.status(400).json({ error: payload.error.flatten() });
  }

  const updated = await prisma.profile.update({
    where: { id: req.params.id },
    data: { cookies: JSON.stringify(payload.data.cookies) }
  });

  res.json({ ok: true, profile: updated });
});

export default router;
