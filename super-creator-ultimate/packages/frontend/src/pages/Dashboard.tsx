import { useEffect, useState } from 'react';
import { fetchJobs, Job } from '../lib/api';

export const DashboardPage = () => {
  const [jobs, setJobs] = useState<Job[]>([]);

  useEffect(() => {
    fetchJobs().then(setJobs).catch(console.error);
  }, []);

  return (
    <section>
      <h2 className="text-2xl font-semibold mb-4">Job Queue</h2>
      <div className="space-y-3">
        {jobs.map((job) => (
          <div key={job.id} className="bg-panel rounded-lg p-4 border border-slate-700">
            <div className="flex justify-between">
              <span>{job.platform} · {job.type}</span>
              <span className="text-xs uppercase tracking-wide bg-slate-800 px-2 py-1 rounded">{job.status}</span>
            </div>
            <p className="text-sm text-muted mt-2 line-clamp-2">{job.prompt}</p>
          </div>
        ))}
      </div>
    </section>
  );
};
