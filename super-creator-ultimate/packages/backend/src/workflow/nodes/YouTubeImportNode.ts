import { PipelineOrchestrator } from '../PipelineOrchestrator';
import { WorkflowContext, WorkflowNode } from '../types';

export class YouTubeImportNode implements WorkflowNode {
  name = 'YouTubeImportNode';
  constructor(private orchestrator: PipelineOrchestrator) {}

  async run(context: WorkflowContext): Promise<void> {
    const url = String(context.input.url ?? '');
    const data = await this.orchestrator.callWorker('/worker/research/youtube', { url });
    context.state.research = data;
    context.logs.push('YouTube research imported');
  }
}
