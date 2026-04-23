export interface StoryboardScene {
  index: number;
  narration: string;
  visualDescription: string;
  styleHint: string;
  durationSeconds: number;
}

export const buildStoryboard = (script: string): StoryboardScene[] => {
  const sentences = script
    .split(/(?<=[.!?])\s+/)
    .map((s) => s.trim())
    .filter(Boolean);

  return sentences.slice(0, 12).map((sentence, idx) => ({
    index: idx + 1,
    narration: sentence,
    visualDescription: `Cinematic shot matching: ${sentence.slice(0, 80)}`,
    styleHint: idx % 2 === 0 ? 'dynamic camera, high contrast' : 'clean composition, soft fill light',
    durationSeconds: 3 + (idx % 3)
  }));
};
