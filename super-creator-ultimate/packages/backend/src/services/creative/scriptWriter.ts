import { runGeminiText } from './geminiClient';

export interface ScriptWriterInput {
  sourceTranscript: string;
  angle: string;
  tone: string;
  targetSeconds?: number;
}

const localRewrite = (input: ScriptWriterInput): string => {
  const sentences = input.sourceTranscript
    .split(/(?<=[.!?])\s+/)
    .map((s) => s.trim())
    .filter(Boolean);

  const opener = `Hook (${input.tone}): ${sentences[0] ?? 'Start with a punchy claim about the topic.'}`;
  const body = sentences.slice(1, 7).map((s, idx) => `Point ${idx + 1}: ${s}`).join('\n');
  const cta = 'CTA: Ask viewers to comment their biggest challenge and subscribe for the next part.';
  const pacing = `Pacing: Keep total runtime near ${input.targetSeconds ?? 45} seconds.`;

  return [
    `Angle: ${input.angle}`,
    opener,
    body,
    cta,
    pacing
  ].filter(Boolean).join('\n\n');
};

export const rewriteScript = async (input: ScriptWriterInput): Promise<string> => {
  const prompt = [
    'You are a professional short-form video script doctor.',
    'Rewrite the source transcript into an original script suitable for voiceover.',
    `Desired angle: ${input.angle}`,
    `Desired tone: ${input.tone}`,
    `Target runtime: ${input.targetSeconds ?? 45} seconds`,
    'Rules:',
    '- Keep core factual meaning but rewrite structure and language.',
    '- Include: Hook, Value sequence, and CTA.',
    '- Return plain text only, no markdown.',
    'Source transcript:',
    input.sourceTranscript
  ].join('\n');

  const generated = await runGeminiText(prompt, 0.8);
  return generated ?? localRewrite(input);
};
