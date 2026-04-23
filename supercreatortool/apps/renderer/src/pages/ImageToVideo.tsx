import { useState } from "react";
import ImageMapper from "../components/ImageMapper";
import { api } from "../lib/api";
export default function ImageToVideo(){ const [projectId,setProjectId]=useState(""); const [items,setItems]=useState([{imagePath:'',prompt:''}]); return <div className="space-y-3"><h2 className="text-2xl font-bold">Image to Video</h2><input className="bg-slate-900 border p-2 rounded border-slate-800" value={projectId} onChange={(e)=>setProjectId(e.target.value)} placeholder="Project ID"/><ImageMapper items={items} onChange={setItems}/><button className="bg-violet-600 px-3 py-2 rounded" onClick={()=>api.post('/image-to-video',{projectId,items,model:'veo-3',aspectRatio:'16:9'})}>Queue</button></div>; }
