import { StoryboardScene } from './storyboard';

export interface ScenePrompt {
  sceneIndex: number;
  positive: string;
  negative: string;
  durationSeconds: number;
}

const DEFAULT_NEGATIVE = 'low quality, blurry, text artifacts, watermarks, duplicate subjects, deformed hands';

export const buildPromptChain = (scenes: StoryboardScene[]): ScenePrompt[] =>
  scenes.map((scene) => ({
    sceneIndex: scene.index,
    positive: [
      'Ultra detailed cinematic shot.',
      `Narrative intent: ${scene.narration}`,
      `Visual direction: ${scene.visualDescription}`,
      `Style: ${scene.styleHint}`,
      `Shot duration ${scene.durationSeconds}s, smooth camera motion, social-video framing`
    ].join(' '),
    negative: DEFAULT_NEGATIVE,
    durationSeconds: scene.durationSeconds
  }));
