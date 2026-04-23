import { Router } from 'express';
import { z } from 'zod';
import { runGeminiText } from '../services/creative/geminiClient';

const router = Router();

const fallbackTitle = (topic: string, hook: string): string => `${hook}: ${topic} (${new Date().getFullYear()})`;

const fallbackDescription = (title: string, script: string): string => {
  const lines = script
    .split(/(?<=[.!?])\s+/)
    .map((s) => s.trim())
    .filter(Boolean)
    .slice(0, 6);

  const chapters = lines.map((line, idx) => {
    const seconds = idx * 20;
    const mm = String(Math.floor(seconds / 60)).padStart(2, '0');
    const ss = String(seconds % 60).padStart(2, '0');
    return `${mm}:${ss} ${line.slice(0, 60)}`;
  });

  return [
    title,
    '',
    'In this video:',
    ...lines.map((l) => `- ${l}`),
    '',
    'Chapters:',
    ...chapters,
    '',
    '#ai #contentcreation #videomarketing'
  ].join('\n');
};

router.post('/title', async (req, res) => {
  const parsed = z.object({ topic: z.string().min(1), hook: z.string().default('Must-watch') }).safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: parsed.error.flatten() });

  const prompt = [
    'Generate 1 SEO-optimized YouTube title for this topic.',
    `Topic: ${parsed.data.topic}`,
    `Hook intent: ${parsed.data.hook}`,
    'Constraints: 55-68 chars, curiosity + clarity, no clickbait lies.',
    'Return only one title line.'
  ].join('\n');

  const generated = await runGeminiText(prompt, 0.9);
  return res.json({ title: generated?.split('\n')[0]?.trim() || fallbackTitle(parsed.data.topic, parsed.data.hook) });
});

router.post('/description', async (req, res) => {
  const parsed = z.object({ title: z.string().min(1), script: z.string().min(1) }).safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: parsed.error.flatten() });

  const prompt = [
    'Write a YouTube description with chapter timestamps.',
    `Title: ${parsed.data.title}`,
    'Include:',
    '- two-sentence summary',
    '- bullet key takeaways',
    '- chapters with mm:ss format',
    '- short CTA and hashtags',
    'Script source:',
    parsed.data.script,
    'Return plain text only.'
  ].join('\n');

  const generated = await runGeminiText(prompt, 0.6);
  return res.json({ description: generated ?? fallbackDescription(parsed.data.title, parsed.data.script) });
});

export default router;
