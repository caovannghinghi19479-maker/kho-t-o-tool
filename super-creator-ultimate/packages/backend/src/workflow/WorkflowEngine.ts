import { randomUUID } from 'node:crypto';

export interface WorkflowRunInput {
  url: string;
  angle?: string;
  tone?: string;
  topic?: string;
  targetSeconds?: number;
}

export interface WorkflowRunRecord {
  id: string;
  status: 'pending' | 'running' | 'completed' | 'failed';
  step: 'Research' | 'Create' | 'Render' | 'Post' | 'Done';
  logs: string[];
  output?: Record<string, unknown>;
  error?: string;
}

const workerBase = process.env.WORKER_URL ?? 'http://127.0.0.1:8001';

const postJson = async <T>(url: string, body: unknown): Promise<T> => {
  const response = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body)
  });
  const payload = (await response.json()) as T;
  if (!response.ok) {
    throw new Error(`Request failed (${response.status}) for ${url}: ${JSON.stringify(payload)}`);
  }
  return payload;
};

export class WorkflowEngine {
  private records = new Map<string, WorkflowRunRecord>();

  async execute(input: WorkflowRunInput): Promise<WorkflowRunRecord> {
    const id = randomUUID();
    const record: WorkflowRunRecord = {
      id,
      status: 'pending',
      step: 'Research',
      logs: ['Workflow accepted']
    };
    this.records.set(id, record);

    void this.runPipeline(record, input);
    return record;
  }

  private async runPipeline(record: WorkflowRunRecord, input: WorkflowRunInput): Promise<void> {
    const output: Record<string, unknown> = {};
    record.status = 'running';

    try {
      record.step = 'Research';
      record.logs.push('Research: downloading and analyzing source video');
      const research = await postJson<Record<string, unknown>>(`${workerBase}/worker/research/youtube`, { url: input.url });
      const videoPath = String(research.video_path ?? '');
      const audioPath = String(research.audio_path ?? videoPath);

      const [frames, transcription] = await Promise.all([
        postJson<Record<string, unknown>>(`${workerBase}/worker/research/extract-frames`, { video_path: videoPath }),
        postJson<Record<string, unknown>>(`${workerBase}/worker/research/transcribe`, { media_path: audioPath })
      ]);

      output.research = research;
      output.frames = frames;
      output.transcription = transcription;

      record.step = 'Create';
      record.logs.push('Create: generating rewritten script, storyboard, and prompts');
      const transcript = String(transcription.text ?? research.transcript_hint ?? '');

      const scriptResp = await postJson<Record<string, unknown>>('http://127.0.0.1:8787/api/creative/script', {
        sourceTranscript: transcript,
        angle: input.angle ?? 'educational',
        tone: input.tone ?? 'engaging',
        targetSeconds: input.targetSeconds ?? 45
      });
      const script = String(scriptResp.script ?? '');
      const storyboardResp = await postJson<Record<string, unknown>>('http://127.0.0.1:8787/api/creative/storyboard', { script });
      const promptsResp = await postJson<Record<string, unknown>>('http://127.0.0.1:8787/api/creative/prompts', {
        scenes: storyboardResp.scenes ?? []
      });

      output.script = scriptResp;
      output.storyboard = storyboardResp;
      output.prompts = promptsResp;

      record.step = 'Render';
      record.logs.push('Render: preparing master video from research source');
      output.render = { video_path: videoPath, strategy: 'source_master' };

      record.step = 'Post';
      record.logs.push('Post: exporting final output and metadata');
      const exportResp = await postJson<Record<string, unknown>>(`${workerBase}/worker/post/export`, {
        video_path: videoPath,
        resolution: '1920x1080',
        fmt: 'mp4',
        crf: 20
      });

      const titleResp = await postJson<Record<string, unknown>>('http://127.0.0.1:8787/api/youtube/title', {
        topic: input.topic ?? 'AI video production',
        hook: 'Watch before you publish'
      });
      const descriptionResp = await postJson<Record<string, unknown>>('http://127.0.0.1:8787/api/youtube/description', {
        title: String(titleResp.title ?? input.topic ?? 'Video'),
        script
      });

      output.post = { export: exportResp, title: titleResp, description: descriptionResp };

      record.step = 'Done';
      record.status = 'completed';
      record.logs.push('Workflow completed successfully');
      record.output = output;
    } catch (error) {
      record.status = 'failed';
      record.error = (error as Error).message;
      record.logs.push(`Workflow failed: ${(error as Error).message}`);
      record.output = output;
    }
  }

  getStatus(id: string): WorkflowRunRecord | null {
    return this.records.get(id) ?? null;
  }
}

export const workflowEngine = new WorkflowEngine();
