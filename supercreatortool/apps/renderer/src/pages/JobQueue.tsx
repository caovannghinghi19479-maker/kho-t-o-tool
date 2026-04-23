import { useEffect } from "react";
import JobStatusRow from "../components/JobStatusRow";
import { useJobStore } from "../store/jobStore";

export default function JobQueue() {
  const { jobs, load, subscribeToEvents } = useJobStore();

  useEffect(() => {
    void load();
    const unsubscribe = subscribeToEvents();
    const t = setInterval(load, 5000);
    return () => {
      unsubscribe();
      clearInterval(t);
    };
  }, []);

  return (
    <div>
      <h2 className="text-2xl font-bold mb-3">Job Queue / History</h2>
      <table className="w-full text-sm">
        <thead>
          <tr className="text-left text-slate-400">
            <th>ID</th><th>Type</th><th>Status</th><th>Progress</th><th>Prompt</th>
          </tr>
        </thead>
        <tbody>{jobs.map((j) => <JobStatusRow key={j.id} job={j} />)}</tbody>
      </table>
    </div>
  );
}
