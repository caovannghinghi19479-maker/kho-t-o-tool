import { useState } from 'react';
import toast from 'react-hot-toast';
import { analyzeResearch, generatePrompts, generateScript, generateStoryboard, PromptResult, ResearchResult, Scene } from '../lib/api';

export const ResearchPage = () => {
  const [url, setUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [research, setResearch] = useState<ResearchResult | null>(null);
  const [script, setScript] = useState('');
  const [scenes, setScenes] = useState<Scene[]>([]);
  const [prompts, setPrompts] = useState<PromptResult[]>([]);

  const run = async () => {
    if (!url.trim()) {
      toast.error('Please enter a YouTube URL');
      return;
    }

    setLoading(true);
    try {
      const researchData = await analyzeResearch(url);
      const sourceTranscript = researchData.transcription?.text || researchData.research?.transcript_hint || '';
      const scriptData = await generateScript({
        sourceTranscript,
        angle: 'insight-led',
        tone: 'fast-paced',
        targetSeconds: 45
      });
      const storyboardData = await generateStoryboard(scriptData.script);
      const promptData = await generatePrompts(storyboardData.scenes);

      setResearch(researchData);
      setScript(scriptData.script);
      setScenes(storyboardData.scenes);
      setPrompts(promptData.prompts);
      toast.success('Research + creative package generated');
    } catch (error) {
      toast.error('Research workflow failed');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="space-y-4">
      <h2 className="text-2xl font-semibold">Research</h2>
      <div className="flex gap-2">
        <input className="flex-1" value={url} onChange={(e) => setUrl(e.target.value)} placeholder="YouTube URL" />
        <button className="bg-accent text-white px-4 py-2 rounded disabled:opacity-60" onClick={run} disabled={loading}>
          {loading ? 'Analyzing...' : 'Analyze'}
        </button>
      </div>

      {research && (
        <div className="grid gap-4 lg:grid-cols-2">
          <div className="bg-panel border border-slate-700 rounded p-4 space-y-3">
            <h3 className="font-semibold">Transcription</h3>
            <p className="text-sm text-slate-300 whitespace-pre-wrap">{research.transcription?.text || 'No transcript available.'}</p>
            <h3 className="font-semibold">Generated Script</h3>
            <p className="text-sm text-slate-300 whitespace-pre-wrap">{script}</p>
          </div>
          <div className="bg-panel border border-slate-700 rounded p-4 space-y-3">
            <h3 className="font-semibold">Storyboard & Prompts</h3>
            <ul className="space-y-2 text-sm">
              {scenes.map((scene) => (
                <li key={scene.index} className="border border-slate-700 rounded p-2">
                  <div className="font-medium">Scene {scene.index} ({scene.durationSeconds}s)</div>
                  <div className="text-slate-300">{scene.narration}</div>
                  <div className="text-slate-400">{prompts.find((p) => p.sceneIndex === scene.index)?.positive}</div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </section>
  );
};
