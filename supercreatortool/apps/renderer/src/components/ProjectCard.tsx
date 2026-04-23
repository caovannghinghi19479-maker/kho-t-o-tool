export default function ProjectCard({ p }: { p: { id: string; name: string; description?: string } }) {
  return <div className="bg-slate-900 border border-slate-800 rounded p-4"><h3 className="font-semibold">{p.name}</h3><p className="text-sm text-slate-400">{p.description}</p></div>;
}
