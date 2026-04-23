import { useState } from 'react';
import toast from 'react-hot-toast';
import { executeWorkflow, getWorkflowStatus } from '../lib/api';

const availableNodes = ['YouTubeImport', 'Transcribe', 'ScriptWriter', 'Storyboard', 'Render', 'PostProcess'];

export const StudioPage = () => {
  const [url, setUrl] = useState('');
  const [workflowId, setWorkflowId] = useState('');
  const [status, setStatus] = useState<any>(null);

  const run = async () => {
    const response = await executeWorkflow({ url, angle: 'educational', tone: 'energetic' });
    setWorkflowId(response.id);
    setStatus(response);
    toast.success('Workflow execution started');
  };

  const refresh = async () => {
    if (!workflowId) return;
    const data = await getWorkflowStatus(workflowId);
    setStatus(data);
  };

  return (
    <section className="space-y-4">
      <h2 className="text-2xl font-semibold">Studio Workflow Builder</h2>
      <p className="text-sm text-muted">Drag-and-drop ready layout scaffold with active backend orchestration.</p>

      <div className="grid grid-cols-6 gap-2">
        {availableNodes.map((node) => (
          <div key={node} className="bg-panel border border-slate-700 rounded p-3 text-center cursor-grab">
            {node}
          </div>
        ))}
      </div>

      <div className="flex gap-2">
        <input className="flex-1" value={url} onChange={(e) => setUrl(e.target.value)} placeholder="YouTube URL for workflow" />
        <button className="bg-accent text-white" onClick={run}>Execute</button>
        <button className="bg-slate-700 text-white" onClick={refresh}>Refresh</button>
      </div>

      {status && <pre className="bg-panel border border-slate-700 rounded p-4 text-xs">{JSON.stringify(status, null, 2)}</pre>}
    </section>
  );
};
