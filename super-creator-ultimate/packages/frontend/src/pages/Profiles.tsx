import { FormEvent, useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { createProfile, fetchProfiles, Profile } from '../lib/api';

export const ProfilesPage = () => {
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [name, setName] = useState('');
  const [platform, setPlatform] = useState<'Veo3' | 'Grok' | 'Gemini'>('Veo3');
  const [proxyUrl, setProxyUrl] = useState('');

  const load = () => fetchProfiles().then(setProfiles).catch(console.error);
  useEffect(() => {
    load();
  }, []);

  const submit = async (event: FormEvent) => {
    event.preventDefault();
    await createProfile({ name, platform, proxyUrl });
    toast.success('Profile created');
    setName('');
    setProxyUrl('');
    await load();
  };

  return (
    <section>
      <h2 className="text-2xl font-semibold mb-4">Browser Profiles</h2>
      <form onSubmit={submit} className="grid grid-cols-4 gap-3 mb-6">
        <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Profile name" required />
        <select value={platform} onChange={(e) => setPlatform(e.target.value as 'Veo3' | 'Grok' | 'Gemini')}>
          <option value="Veo3">Veo3</option>
          <option value="Grok">Grok</option>
          <option value="Gemini">Gemini</option>
        </select>
        <input value={proxyUrl} onChange={(e) => setProxyUrl(e.target.value)} placeholder="Proxy URL (optional)" />
        <button className="bg-accent text-white">Create</button>
      </form>

      <div className="space-y-2">
        {profiles.map((profile) => (
          <div key={profile.id} className="rounded border border-slate-700 bg-panel p-3 flex justify-between">
            <span>{profile.name} · {profile.platform}</span>
            <span className="text-sm text-muted">{profile.proxyUrl || 'No proxy'}</span>
          </div>
        ))}
      </div>
    </section>
  );
};
