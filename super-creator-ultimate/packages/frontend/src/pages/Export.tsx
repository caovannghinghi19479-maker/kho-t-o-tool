import { useState } from 'react';
import toast from 'react-hot-toast';
import { burnSubtitles, concatVideos, exportVideo, generateDescription, generateTitle } from '../lib/api';

export const ExportPage = () => {
  const [videoPath, setVideoPath] = useState('');
  const [secondVideoPath, setSecondVideoPath] = useState('');
  const [srtPath, setSrtPath] = useState('');
  const [topic, setTopic] = useState('AI video growth hacks');
  const [script, setScript] = useState('Hook. Value. CTA.');
  const [output, setOutput] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const runExport = async () => {
    if (!videoPath.trim()) {
      toast.error('Input video path is required');
      return;
    }

    setLoading(true);
    try {
      const merged = secondVideoPath
        ? await concatVideos({ video_paths: [videoPath, secondVideoPath], transition: 'none' })
        : { output_path: videoPath };

      const burned = srtPath ? await burnSubtitles({ video_path: merged.output_path, srt_path: srtPath }) : merged;
      const exported = await exportVideo({ video_path: burned.output_path, resolution: '1920x1080', fmt: 'mp4', crf: 20 });
      const title = await generateTitle(topic, 'Watch before posting');
      const description = await generateDescription(title.title, script);
      setOutput({ merged, burned, exported, title, description });
      toast.success('Export pipeline completed');
    } catch (error) {
      toast.error('Export failed');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="space-y-4">
      <h2 className="text-2xl font-semibold">Export</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <input value={videoPath} onChange={(e) => setVideoPath(e.target.value)} placeholder="Input video path" />
        <input value={secondVideoPath} onChange={(e) => setSecondVideoPath(e.target.value)} placeholder="Second segment path (optional)" />
        <input value={srtPath} onChange={(e) => setSrtPath(e.target.value)} placeholder="SRT path (optional)" />
        <input value={topic} onChange={(e) => setTopic(e.target.value)} placeholder="Video topic" />
        <input className="md:col-span-2" value={script} onChange={(e) => setScript(e.target.value)} placeholder="Script summary" />
      </div>
      <button className="bg-accent text-white px-4 py-2 rounded disabled:opacity-60" onClick={runExport} disabled={loading}>
        {loading ? 'Processing...' : 'Run Export'}
      </button>
      {output && (
        <pre className="bg-panel border border-slate-700 rounded p-4 text-xs overflow-auto max-h-[460px]">
          {JSON.stringify(output, null, 2)}
        </pre>
      )}
    </section>
  );
};
