import { useEffect } from "react";
import { useProjectStore } from "../store/projectStore";
import { useJobStore } from "../store/jobStore";

export default function Dashboard() {
  const { projects, load: loadProjects } = useProjectStore();
  const { jobs, load: loadJobs } = useJobStore();
  useEffect(() => { loadProjects(); loadJobs(); const t=setInterval(loadJobs,2000); return ()=>clearInterval(t); }, []);
  const success = jobs.length ? Math.round((jobs.filter((j)=>j.status==="done").length / jobs.length) * 100) : 0;
  return <div className="space-y-4"><h2 className="text-2xl font-bold">Dashboard</h2><div className="grid grid-cols-4 gap-3">{[["Total projects",projects.length],["Total jobs",jobs.length],["Success rate",`${success}%`],["Running",jobs.filter((j)=>j.status==="running").length]].map(([k,v])=><div key={String(k)} className="bg-slate-900 rounded border border-slate-800 p-4"><p className="text-slate-400">{k}</p><p className="text-2xl">{v}</p></div>)}</div></div>;
}
