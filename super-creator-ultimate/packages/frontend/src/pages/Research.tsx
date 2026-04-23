import { useState } from 'react';
import toast from 'react-hot-toast';
import { analyzeResearch, generateScript, generateStoryboard } from '../lib/api';

export const ResearchPage = () => {
  const [url, setUrl] = useState('');
  const [result, setResult] = useState<any>(null);

  const run = async () => {
    try {
      const data = await analyzeResearch(url);
      const scriptData = await generateScript({
        sourceTranscript: data.transcription?.text ?? data.research?.transcript_hint ?? '',
        angle: 'insight-led',
        tone: 'fast-paced'
      });
      const storyboardData = await generateStoryboard(scriptData.script);
      setResult({ ...data, script: scriptData, storyboard: storyboardData });
      toast.success('Research pipeline completed');
    } catch (error) {
      toast.error('Research pipeline failed');
      console.error(error);
    }
  };

  return (
    <section className="space-y-4">
      <h2 className="text-2xl font-semibold">Research</h2>
      <div className="flex gap-2">
        <input className="flex-1" value={url} onChange={(e) => setUrl(e.target.value)} placeholder="YouTube URL" />
        <button className="bg-accent text-white" onClick={run}>Analyze</button>
      </div>
      {result && (
        <pre className="bg-panel border border-slate-700 rounded p-4 text-xs overflow-auto max-h-[500px]">
          {JSON.stringify(result, null, 2)}
        </pre>
      )}
    </section>
  );
};
