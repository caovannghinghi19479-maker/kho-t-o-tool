import { Router } from 'express';
import { z } from 'zod';

const router = Router();
const workerBase = process.env.WORKER_URL ?? 'http://127.0.0.1:8001';

const workerPost = async (path: string, body: unknown) => {
  const response = await fetch(`${workerBase}${path}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body)
  });
  const payload = await response.json();
  return { status: response.status, payload };
};

router.post('/burn-subtitles', async (req, res) => {
  const parsed = z.object({ video_path: z.string().min(1), srt_path: z.string().min(1), output_path: z.string().optional() }).safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: parsed.error.flatten() });

  const result = await workerPost('/worker/post/burn-subtitles', parsed.data);
  return res.status(result.status).json(result.payload);
});

router.post('/concat', async (req, res) => {
  const parsed = z
    .object({
      video_paths: z.array(z.string().min(1)).min(2),
      output_path: z.string().optional(),
      transition: z.enum(['none', 'fade']).default('none')
    })
    .safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: parsed.error.flatten() });

  const result = await workerPost('/worker/post/concat', parsed.data);
  return res.status(result.status).json(result.payload);
});

router.post('/export', async (req, res) => {
  const parsed = z
    .object({
      video_path: z.string().min(1),
      resolution: z.string().default('1920x1080'),
      fmt: z.string().default('mp4'),
      crf: z.number().int().min(10).max(40).default(20)
    })
    .safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: parsed.error.flatten() });

  const result = await workerPost('/worker/post/export', parsed.data);
  return res.status(result.status).json(result.payload);
});

export default router;
