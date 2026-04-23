import { PipelineOrchestrator } from '../PipelineOrchestrator';
import { WorkflowContext, WorkflowNode } from '../types';

export class TranscribeNode implements WorkflowNode {
  name = 'TranscribeNode';
  constructor(private orchestrator: PipelineOrchestrator) {}

  async run(context: WorkflowContext): Promise<void> {
    const research = context.state.research as Record<string, any>;
    const mediaPath = String(research?.audio_path ?? research?.video_path ?? '');
    const data = await this.orchestrator.callWorker('/worker/research/transcribe', { media_path: mediaPath });
    context.state.transcription = data;
    context.logs.push('Transcription completed');
  }
}
