import { Router } from 'express';
import { z } from 'zod';

const router = Router();
const workerBase = process.env.WORKER_URL ?? 'http://127.0.0.1:8001';

router.post('/analyze', async (req, res) => {
  const parsed = z.object({ url: z.string().url() }).safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: parsed.error.flatten() });

  try {
    const researchResp = await fetch(`${workerBase}/worker/research/youtube`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ url: parsed.data.url })
    });
    const research = await researchResp.json();

    const [frames, transcription] = await Promise.all([
      fetch(`${workerBase}/worker/research/extract-frames`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ video_path: research.video_path })
      }).then((r) => r.json()),
      fetch(`${workerBase}/worker/research/transcribe`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ media_path: research.audio_path ?? research.video_path })
      }).then((r) => r.json())
    ]);

    return res.json({ research, frames, transcription });
  } catch (error) {
    return res.status(500).json({ error: (error as Error).message });
  }
});

export default router;
