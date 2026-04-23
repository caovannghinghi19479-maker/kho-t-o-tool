import { Router } from 'express';
import { z } from 'zod';
import { analyzeHook } from '../services/creative/hookAnalyzer';
import { scoreOriginality } from '../services/creative/originalityScorer';
import { buildPromptChain } from '../services/creative/promptChain';
import { checkPromptSimilarity } from '../services/creative/similarityGuard';
import { rewriteScript } from '../services/creative/scriptWriter';
import { buildStoryboard } from '../services/creative/storyboard';

const router = Router();

router.post('/script', async (req, res) => {
  const parsed = z
    .object({ sourceTranscript: z.string().min(1), angle: z.string().default('educational'), tone: z.string().default('engaging') })
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

  const scenes = buildStoryboard(parsed.data.script);
  const prompts = buildPromptChain(scenes);
  const similarity = prompts.map((p) => checkPromptSimilarity(p, ['dramatic close-up with text overlay', 'cinematic product reveal']))
  return res.json({ scenes, prompts, similarity });
});

export default router;
