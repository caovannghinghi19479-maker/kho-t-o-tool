import { useEffect, useMemo, useState } from 'react';
import toast from 'react-hot-toast';
import { api, fetchProfiles, Profile } from '../lib/api';

type Platform = 'Veo3' | 'Grok' | 'Gemini';

export const AutomationStudioPage = () => {
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [profileId, setProfileId] = useState('');
  const [platform, setPlatform] = useState<Platform>('Veo3');
  const [prompt, setPrompt] = useState('');
  const [logs, setLogs] = useState<string[]>([]);

  useEffect(() => {
    fetchProfiles().then((items) => {
      setProfiles(items);
      if (items[0]) setProfileId(items[0].id);
    });
  }, []);

  const endpoint = useMemo(() => {
    if (platform === 'Veo3') return '/automation/veo/generate';
    if (platform === 'Grok') return '/automation/grok/text2image';
    return '/automation/gemini/internal';
  }, [platform]);

  const runAutomation = async () => {
    if (!profileId || !prompt.trim()) {
      toast.error('Select a profile and enter a prompt.');
      return;
    }
    const { data: job } = await api.post(endpoint, { profileId, prompt });
    setLogs([`Job ${job.id} queued for ${platform}`]);

    const source = new EventSource(`/api/jobs/${job.id}/stream`);
    source.onmessage = (event) => {
      const parsed = JSON.parse(event.data);
      if (parsed.type === 'progress') {
        setLogs((prev) => [...prev, `${parsed.payload.status}: ${parsed.payload.message}`]);
        if (['completed', 'failed'].includes(parsed.payload.status)) {
          source.close();
        }
      }
    };

    source.onerror = () => {
      toast.error('SSE stream disconnected');
      source.close();
    };
  };

  return (
    <section className="space-y-4">
      <h2 className="text-2xl font-semibold">Automation Studio</h2>
      <div className="grid grid-cols-3 gap-3">
        <select value={profileId} onChange={(e) => setProfileId(e.target.value)}>
          {profiles.map((p) => (
            <option key={p.id} value={p.id}>{p.name} · {p.platform}</option>
          ))}
        </select>
        <select value={platform} onChange={(e) => setPlatform(e.target.value as Platform)}>
          <option>Veo3</option>
          <option>Grok</option>
          <option>Gemini</option>
        </select>
        <button onClick={runAutomation} className="bg-accent text-white">Run Automation</button>
      </div>
      <textarea rows={8} value={prompt} onChange={(e) => setPrompt(e.target.value)} placeholder="Describe your creative goal..." />

      <div className="bg-panel rounded p-4 border border-slate-700">
        <h3 className="font-semibold mb-2">Live Logs</h3>
        <ul className="space-y-1 text-sm text-slate-300">
          {logs.map((entry, index) => <li key={`${entry}-${index}`}>{entry}</li>)}
        </ul>
      </div>
    </section>
  );
};
