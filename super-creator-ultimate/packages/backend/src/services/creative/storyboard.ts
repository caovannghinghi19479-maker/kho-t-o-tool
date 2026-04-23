import { runGeminiText } from './geminiClient';

export interface StoryboardScene {
  index: number;
  narration: string;
  visualDescription: string;
  styleHint: string;
  durationSeconds: number;
}

const fallbackStoryboard = (script: string): StoryboardScene[] => {
  const sentences = script.split(/(?<=[.!?])\s+/).map((s) => s.trim()).filter(Boolean);
  return sentences.slice(0, 10).map((sentence, idx) => ({
    index: idx + 1,
    narration: sentence,
    visualDescription: `Scene built around: ${sentence.slice(0, 120)}`,
    styleHint: idx % 2 === 0 ? 'cinematic, punch-in, high contrast' : 'clean, stabilized, soft key light',
    durationSeconds: 3 + (idx % 3)
  }));
};

const parseStoryboardText = (raw: string): StoryboardScene[] => {
  const lines = raw.split('\n').map((l) => l.trim()).filter(Boolean);
  const scenes: StoryboardScene[] = [];

  for (const line of lines) {
    const match = line.match(/^(\d+)\s*\|\s*(.*?)\s*\|\s*(.*?)\s*\|\s*(.*?)\s*\|\s*(\d+(?:\.\d+)?)$/);
    if (!match) continue;
    scenes.push({
      index: Number(match[1]),
      narration: match[2],
      visualDescription: match[3],
      styleHint: match[4],
      durationSeconds: Number(match[5])
    });
  }

  return scenes;
};

export const buildStoryboard = async (script: string): Promise<StoryboardScene[]> => {
  const prompt = [
    'Create a scene storyboard for a short-form video.',
    'Output format: one line per scene as',
    'index|narration|visualDescription|styleHint|durationSeconds',
    'Use 6-10 scenes.',
    'Script:',
    script
  ].join('\n');

  const generated = await runGeminiText(prompt, 0.6);
  if (!generated) return fallbackStoryboard(script);

  const parsed = parseStoryboardText(generated);
  return parsed.length > 0 ? parsed : fallbackStoryboard(script);
};
