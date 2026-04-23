import { WorkflowContext, WorkflowNode } from '../types';

export class RenderNode implements WorkflowNode {
  name = 'RenderNode';

  async run(context: WorkflowContext): Promise<void> {
    const prompts = (context.state.prompts as string[]) ?? [];
    const virtualSegments = prompts.map((_, idx) => `/tmp/render_segment_${idx + 1}.mp4`);
    context.state.renderSegments = virtualSegments;
    context.logs.push(`Render simulated for ${virtualSegments.length} segments`);
  }
}
