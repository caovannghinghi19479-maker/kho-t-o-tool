import { useState } from 'react';
import toast from 'react-hot-toast';
import { api } from '../lib/api';

export const SettingsPage = () => {
  const [licenseKey, setLicenseKey] = useState('');
  const [proxyList, setProxyList] = useState('');
  const [geminiKey, setGeminiKey] = useState('');

  const validateLicense = async () => {
    try {
      const { data } = await api.post('/license/validate', { key: licenseKey });
      toast.success(`License valid. Machine: ${data.machineId.slice(0, 12)}...`);
    } catch (error) {
      toast.error('License validation failed');
      console.error(error);
    }
  };

  return (
    <section className="space-y-6">
      <h2 className="text-2xl font-semibold">Settings</h2>

      <div className="bg-panel p-4 rounded border border-slate-700 space-y-2">
        <h3 className="font-medium">License</h3>
        <input value={licenseKey} onChange={(e) => setLicenseKey(e.target.value)} placeholder="Enter license key" />
        <button onClick={validateLicense} className="bg-accent text-white">Validate License</button>
      </div>

      <div className="bg-panel p-4 rounded border border-slate-700 space-y-2">
        <h3 className="font-medium">Proxy Pool</h3>
        <textarea rows={4} value={proxyList} onChange={(e) => setProxyList(e.target.value)} placeholder="http://proxy1\nhttp://proxy2" />
      </div>

      <div className="bg-panel p-4 rounded border border-slate-700 space-y-2">
        <h3 className="font-medium">Gemini API Key</h3>
        <input value={geminiKey} onChange={(e) => setGeminiKey(e.target.value)} placeholder="AIza..." />
      </div>
    </section>
  );
};
