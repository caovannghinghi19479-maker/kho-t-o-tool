import { randomUUID } from 'node:crypto';
import { PipelineOrchestrator } from './PipelineOrchestrator';
import { PostProcessNode } from './nodes/PostProcessNode';
import { RenderNode } from './nodes/RenderNode';
import { ScriptWriterNode } from './nodes/ScriptWriterNode';
import { StoryboardNode } from './nodes/StoryboardNode';
import { TranscribeNode } from './nodes/TranscribeNode';
import { YouTubeImportNode } from './nodes/YouTubeImportNode';
import { WorkflowContext, WorkflowNode } from './types';

export interface WorkflowRunRecord {
  id: string;
  status: 'pending' | 'running' | 'completed' | 'failed';
  logs: string[];
  output?: Record<string, unknown>;
  error?: string;
}

export class WorkflowEngine {
  private records = new Map<string, WorkflowRunRecord>();

  async execute(input: Record<string, unknown>): Promise<WorkflowRunRecord> {
    const id = randomUUID();
    const record: WorkflowRunRecord = { id, status: 'pending', logs: [] };
    this.records.set(id, record);

    const orchestrator = new PipelineOrchestrator();
    const nodes: WorkflowNode[] = [
      new YouTubeImportNode(orchestrator),
      new TranscribeNode(orchestrator),
      new ScriptWriterNode(),
      new StoryboardNode(),
      new RenderNode(),
      new PostProcessNode(orchestrator)
    ];

    const context: WorkflowContext = { workflowId: id, input, state: {}, logs: record.logs };

    record.status = 'running';
    try {
      for (const node of nodes) {
        record.logs.push(`Running ${node.name}`);
        await node.run(context);
      }
      record.status = 'completed';
      record.output = context.state;
    } catch (error) {
      record.status = 'failed';
      record.error = (error as Error).message;
      record.logs.push(`Error: ${(error as Error).message}`);
    }

    return record;
  }

  getStatus(id: string): WorkflowRunRecord | null {
    return this.records.get(id) ?? null;
  }
}

export const workflowEngine = new WorkflowEngine();
