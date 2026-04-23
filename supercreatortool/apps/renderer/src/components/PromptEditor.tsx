export default function PromptEditor({ value, onChange }: { value: string; onChange: (v: string)=>void }) {
  return <textarea className="w-full h-40 bg-slate-900 border border-slate-800 rounded p-3" value={value} onChange={(e)=>onChange(e.target.value)} placeholder="One prompt per line" />;
}
