import { StoryboardScene } from './storyboard';

export const buildPromptChain = (scenes: StoryboardScene[]): string[] =>
  scenes.map(
    (scene) =>
      `VEO3 prompt: ${scene.visualDescription}. Narration intent: ${scene.narration}. Style: ${scene.styleHint}. Duration ${scene.durationSeconds}s.`
  );
