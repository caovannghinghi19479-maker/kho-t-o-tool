import { useMemo, useState } from 'react';
import toast from 'react-hot-toast';
import { executeWorkflow, getWorkflowStatus, WorkflowStatus } from '../lib/api';

const nodes = ['Research', 'Create', 'Render', 'Post'];

export const StudioPage = () => {
  const [url, setUrl] = useState('');
  const [topic, setTopic] = useState('AI video production');
  const [status, setStatus] = useState<WorkflowStatus | null>(null);
  const [running, setRunning] = useState(false);

  const run = async () => {
    if (!url.trim()) {
      toast.error('Please provide a source URL');
      return;
    }

    setRunning(true);
    try {
      const data = await executeWorkflow({
        url,
        angle: 'educational',
        tone: 'energetic',
        topic,
        targetSeconds: 45
      });
      setStatus(data);
      toast.success('Workflow started');
    } catch (error) {
      toast.error('Failed to start workflow');
      console.error(error);
    } finally {
      setRunning(false);
    }
  };

  const refresh = async () => {
    if (!status?.id) return;
    const data = await getWorkflowStatus(status.id);
    setStatus(data);
  };

  const stepClass = useMemo(() => {
    const current = status?.step;
    return (node: string) => {
      if (!current) return 'border-slate-700';
      if (node === current) return 'border-violet-500 bg-violet-500/10';
      return 'border-slate-700';
    };
  }, [status?.step]);

  return (
    <section className="space-y-4">
      <h2 className="text-2xl font-semibold">Studio Workflow</h2>
      <p className="text-sm text-muted">Linear builder with Research → Create → Render → Post execution.</p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <input value={url} onChange={(e) => setUrl(e.target.value)} placeholder="YouTube URL" />
        <input value={topic} onChange={(e) => setTopic(e.target.value)} placeholder="Topic for title generation" />
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
        {nodes.map((node) => (
          <div key={node} className={`bg-panel border rounded p-3 text-center ${stepClass(node)}`}>
            {node}
          </div>
        ))}
      </div>

      <div className="flex gap-2">
        <button className="bg-accent text-white px-4 py-2 rounded disabled:opacity-60" onClick={run} disabled={running}>
          {running ? 'Starting...' : 'Execute'}
        </button>
        <button className="bg-slate-700 text-white px-4 py-2 rounded" onClick={refresh} disabled={!status?.id}>
          Refresh Status
        </button>
      </div>

      {status && (
        <div className="bg-panel border border-slate-700 rounded p-4 text-sm space-y-2">
          <div><strong>ID:</strong> {status.id}</div>
          <div><strong>Status:</strong> {status.status}</div>
          <div><strong>Step:</strong> {status.step}</div>
          {status.error && <div className="text-red-400"><strong>Error:</strong> {status.error}</div>}
          <div>
            <strong>Logs:</strong>
            <ul className="list-disc pl-5 mt-1 space-y-1 text-slate-300">
              {status.logs.map((log, idx) => (
                <li key={`${idx}-${log}`}>{log}</li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </section>
  );
};
