export default function ProgressBar({ value }: { value: number }) {
  return <div className="w-full bg-slate-800 rounded h-2"><div className="bg-violet-600 h-2 rounded" style={{ width: `${value}%` }} /></div>;
}
