import { useState } from "react";
import PromptEditor from "../components/PromptEditor";
import { api } from "../lib/api";

export default function TextToVideo(){
  const [projectId,setProjectId]=useState(""); const [prompts,setPrompts]=useState("");
  return <div className="space-y-3"><h2 className="text-2xl font-bold">Text to Video</h2><input className="bg-slate-900 border border-slate-800 rounded p-2" placeholder="Project ID" value={projectId} onChange={(e)=>setProjectId(e.target.value)} /><PromptEditor value={prompts} onChange={setPrompts} /><button className="bg-violet-600 px-3 py-2 rounded" onClick={()=>api.post('/text-to-video',{projectId,prompts:prompts.split('\n').filter(Boolean),model:'veo-3',aspectRatio:'16:9'})}>Start Generation</button></div>;
}
