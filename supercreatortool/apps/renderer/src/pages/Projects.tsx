import { useEffect, useState } from "react";
import { useProjectStore } from "../store/projectStore";
import ProjectCard from "../components/ProjectCard";

export default function Projects() {
  const { projects, load, createProject } = useProjectStore();
  const [name, setName] = useState("");
  useEffect(()=>{void load();},[]);
  return <div><h2 className="text-2xl font-bold mb-3">Projects</h2><div className="flex gap-2 mb-4"><input className="bg-slate-900 border border-slate-800 rounded p-2" placeholder="Project name" value={name} onChange={(e)=>setName(e.target.value)} /><button className="bg-violet-600 px-3 rounded" onClick={()=>{void createProject(name); setName("");}}>Create</button></div><div className="grid grid-cols-3 gap-3">{projects.map((p)=><ProjectCard key={p.id} p={p} />)}</div></div>;
}
