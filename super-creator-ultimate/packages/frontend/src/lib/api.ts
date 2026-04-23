import axios from 'axios';

export const api = axios.create({ baseURL: '/api' });

export interface ResearchResult {
  research: { video_path: string; audio_path?: string; metadata?: Record<string, unknown>; transcript_hint?: string };
  frames: { keyframes: string[] };
  transcription: { text: string; words?: Array<{ word: string; start: number; end: number }> };
}

export interface Scene {
  index: number;
  narration: string;
  visualDescription: string;
  styleHint: string;
  durationSeconds: number;
}

export interface PromptResult {
  sceneIndex: number;
  positive: string;
  negative: string;
  durationSeconds: number;
}

export const analyzeResearch = async (url: string): Promise<ResearchResult> => (await api.post('/research/analyze', { url })).data;
export const generateScript = async (payload: { sourceTranscript: string; angle: string; tone: string; targetSeconds?: number }): Promise<{ script: string }> =>
  (await api.post('/creative/script', payload)).data;
export const generateStoryboard = async (script: string): Promise<{ scenes: Scene[] }> => (await api.post('/creative/storyboard', { script })).data;
export const generatePrompts = async (scenes: Scene[]): Promise<{ prompts: PromptResult[] }> => (await api.post('/creative/prompts', { scenes })).data;

export interface WorkflowStatus {
  id: string;
  status: 'pending' | 'running' | 'completed' | 'failed';
  step: string;
  logs: string[];
  output?: Record<string, unknown>;
  error?: string;
}

export const executeWorkflow = async (payload: { url: string; angle?: string; tone?: string; topic?: string; targetSeconds?: number }): Promise<WorkflowStatus> =>
  (await api.post('/workflow/execute', payload)).data;
export const getWorkflowStatus = async (id: string): Promise<WorkflowStatus> => (await api.get(`/workflow/status/${id}`)).data;

export const burnSubtitles = async (payload: { video_path: string; srt_path: string; output_path?: string }): Promise<{ output_path: string }> =>
  (await api.post('/post/burn-subtitles', payload)).data;
export const concatVideos = async (payload: { video_paths: string[]; output_path?: string; transition?: 'none' | 'fade' }): Promise<{ output_path: string }> =>
  (await api.post('/post/concat', payload)).data;
export const exportVideo = async (payload: { video_path: string; resolution: string; fmt: string; crf: number }): Promise<{ output_path: string }> =>
  (await api.post('/post/export', payload)).data;

export const generateTitle = async (topic: string, hook: string): Promise<{ title: string }> => (await api.post('/youtube/title', { topic, hook })).data;
export const generateDescription = async (title: string, script: string): Promise<{ description: string }> =>
  (await api.post('/youtube/description', { title, script })).data;
