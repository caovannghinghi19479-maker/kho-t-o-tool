import axios from 'axios';

export const api = axios.create({ baseURL: '/api' });

export interface Profile {
  id: string;
  name: string;
  platform: 'Veo3' | 'Grok' | 'Gemini';
  userDataDir: string;
  proxyUrl?: string | null;
}

export interface Job {
  id: string;
  platform: string;
  type: string;
  prompt: string;
  status: string;
  resultUrl?: string | null;
  createdAt: string;
}

export const fetchProfiles = async (): Promise<Profile[]> => (await api.get('/profiles')).data;
export const createProfile = async (payload: Partial<Profile>): Promise<Profile> => (await api.post('/profiles', payload)).data;
export const fetchJobs = async (): Promise<Job[]> => (await api.get('/jobs')).data;

export const analyzeResearch = async (url: string): Promise<any> => (await api.post('/research/analyze', { url })).data;
export const generateScript = async (payload: { sourceTranscript: string; angle: string; tone: string }): Promise<any> =>
  (await api.post('/creative/script', payload)).data;
export const generateStoryboard = async (script: string): Promise<any> => (await api.post('/creative/storyboard', { script })).data;

export const executeWorkflow = async (payload: { url: string; angle?: string; tone?: string }): Promise<any> =>
  (await api.post('/workflow/execute', payload)).data;
export const getWorkflowStatus = async (id: string): Promise<any> => (await api.get(`/workflow/status/${id}`)).data;

export const burnSubtitles = async (payload: { video_path: string; srt_path: string; output_path?: string }): Promise<any> =>
  (await api.post('/post/burn-subtitles', payload)).data;
export const exportVideo = async (payload: { video_path: string; resolution: string; fmt: string; crf: number }): Promise<any> =>
  (await api.post('/post/export', payload)).data;

export const generateTitle = async (topic: string, hook: string): Promise<any> => (await api.post('/youtube/title', { topic, hook })).data;
export const generateDescription = async (title: string, script: string): Promise<any> =>
  (await api.post('/youtube/description', { title, script })).data;
