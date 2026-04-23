import { Router } from 'express';
import { z } from 'zod';

const router = Router();
const workerBase = process.env.WORKER_URL ?? 'http://127.0.0.1:8001';

router.post('/burn-subtitles', async (req, res) => {
  const parsed = z.object({ video_path: z.string().min(1), srt_path: z.string().min(1), output_path: z.string().optional() }).safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: parsed.error.flatten() });

  const response = await fetch(`${workerBase}/worker/post/burn-subtitles`, {
    method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(parsed.data)
  });
  return res.status(response.status).json(await response.json());
});

router.post('/export', async (req, res) => {
  const parsed = z.object({ video_path: z.string().min(1), resolution: z.string().default('1920x1080'), fmt: z.string().default('mp4'), crf: z.number().int().min(10).max(40).default(20) }).safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: parsed.error.flatten() });

  const response = await fetch(`${workerBase}/worker/post/export`, {
    method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(parsed.data)
  });
  return res.status(response.status).json(await response.json());
});

export default router;
