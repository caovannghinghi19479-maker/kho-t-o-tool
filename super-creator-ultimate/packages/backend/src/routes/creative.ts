import { Router } from 'express';
import { z } from 'zod';
import { analyzeHook } from '../services/creative/hookAnalyzer';
import { scoreOriginality } from '../services/creative/originalityScorer';
import { buildPromptChain } from '../services/creative/promptChain';
import { rewriteScript } from '../services/creative/scriptWriter';
import { buildStoryboard } from '../services/creative/storyboard';

const router = Router();

router.post('/script', async (req, res) => {
  const parsed = z
    .object({
      sourceTranscript: z.string().min(1),
      angle: z.string().default('educational'),
      tone: z.string().default('engaging'),
      targetSeconds: z.number().int().min(15).max(180).default(45)
    })
    .safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: parsed.error.flatten() });

  const script = await rewriteScript(parsed.data);
  const originality = scoreOriginality(parsed.data.sourceTranscript, script);
  const hook = analyzeHook({ transcript: script, visualComplexity: 0.15, motionScore: 0.08 });
  return res.json({ script, originality, hook });
});

router.post('/storyboard', async (req, res) => {
  const parsed = z.object({ script: z.string().min(1) }).safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: parsed.error.flatten() });

  const scenes = await buildStoryboard(parsed.data.script);
  return res.json({ scenes });
});

router.post('/prompts', async (req, res) => {
  const parsed = z
    .object({
      scenes: z.array(
        z.object({
          index: z.number(),
          narration: z.string(),
          visualDescription: z.string(),
          styleHint: z.string(),
          durationSeconds: z.number()
        })
      )
    })
    .safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: parsed.error.flatten() });

  const prompts = buildPromptChain(parsed.data.scenes);
  return res.json({ prompts });
});

export default router;
