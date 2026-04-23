import { NavLink } from "react-router-dom";
const nav = ["Dashboard","Projects","CompetitorClone","TextToVideo","ImageToVideo","StartEndVideo","IdeaToVideo","CharacterSync","CreateImage","Storyboard","ThumbnailStudio","JobQueue","Settings"];
export default function Sidebar() {
  return <aside className="w-[220px] bg-slate-900 border-r border-slate-800 p-3 min-h-screen fixed"><h1 className="text-lg font-bold mb-4">SuperCreatorTool</h1><nav className="space-y-1">{nav.map((n)=><NavLink key={n} to={`/${n}`} className={({isActive})=>`block px-3 py-2 rounded ${isActive?"bg-violet-600":"hover:bg-slate-800"}`}>{n}</NavLink>)}</nav></aside>;
}
