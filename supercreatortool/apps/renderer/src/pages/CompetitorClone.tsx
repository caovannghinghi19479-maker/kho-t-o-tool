import { useState } from "react";
import { api } from "../lib/api";

export default function CompetitorClone() {
  const [videoUrl, setVideoUrl] = useState("");
  const [localVideoPath, setLocalVideoPath] = useState("");
  const [analysis, setAnalysis] = useState<any>(null);
  const [creative, setCreative] = useState<any>(null);
  const [sceneCount, setSceneCount] = useState(8);
  return <div className="space-y-4"><h2 className="text-2xl font-bold">Competitor Clone</h2><div className="grid grid-cols-2 gap-2"><input className="bg-slate-900 border border-slate-800 rounded p-2" placeholder="Video URL" value={videoUrl} onChange={(e)=>setVideoUrl(e.target.value)} /><input className="bg-slate-900 border border-slate-800 rounded p-2" placeholder="Local path" value={localVideoPath} onChange={(e)=>setLocalVideoPath(e.target.value)} /></div><button className="bg-violet-600 px-3 py-2 rounded" onClick={async()=>setAnalysis((await api.post('/competitor/analyze',{videoUrl,localVideoPath})).data)}>Analyze Video</button>{analysis && <div className="bg-slate-900 border border-slate-800 rounded p-3"><pre className="text-xs overflow-auto max-h-80">{JSON.stringify(analysis, null, 2)}</pre><div className="mt-3 flex items-center gap-2"><input type="range" min={1} max={30} value={sceneCount} onChange={(e)=>setSceneCount(Number(e.target.value))} /><span>{sceneCount} scenes</span><button className="bg-violet-600 px-3 py-1 rounded" onClick={async()=>setCreative((await api.post('/competitor/generate-prompts',{analysisId:analysis.analysisId,sceneCount})).data)}>Generate Creative Package</button></div></div>}{creative && <pre className="bg-slate-900 border border-slate-800 rounded p-3 text-xs overflow-auto">{JSON.stringify(creative, null, 2)}</pre>}</div>;
}
