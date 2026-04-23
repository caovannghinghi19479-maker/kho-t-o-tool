import ProgressBar from "./ProgressBar";
export default function JobStatusRow({ job }: { job: { id: string; type: string; status: string; progress: number; prompt?: string } }) {
  return <tr className="border-b border-slate-800"><td>{job.id.slice(0,8)}</td><td>{job.type}</td><td>{job.status}</td><td className="w-48"><ProgressBar value={job.progress} /></td><td className="text-xs text-slate-400">{job.prompt}</td></tr>;
}
