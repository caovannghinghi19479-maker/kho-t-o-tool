import { PipelineOrchestrator } from '../PipelineOrchestrator';
import { WorkflowContext, WorkflowNode } from '../types';

export class PostProcessNode implements WorkflowNode {
  name = 'PostProcessNode';
  constructor(private orchestrator: PipelineOrchestrator) {}

  async run(context: WorkflowContext): Promise<void> {
    const segments = (context.state.renderSegments as string[]) ?? [];
    if (segments.length < 2) {
      context.state.finalVideo = segments[0] ?? null;
      context.logs.push('Post process skipped concat (single segment)');
      return;
    }
    const concat = await this.orchestrator.callWorker<{ output_path: string }>('/worker/post/concat', { video_paths: segments });
    const exported = await this.orchestrator.callWorker<{ output_path: string }>('/worker/post/export', {
      video_path: concat.output_path,
      resolution: '1920x1080',
      fmt: 'mp4',
      crf: 20
    });
    context.state.finalVideo = exported.output_path;
    context.logs.push('Post process complete');
  }
}
