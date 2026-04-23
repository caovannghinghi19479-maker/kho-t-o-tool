import { rewriteScript } from '../../services/creative/scriptWriter';
import { WorkflowContext, WorkflowNode } from '../types';

export class ScriptWriterNode implements WorkflowNode {
  name = 'ScriptWriterNode';

  async run(context: WorkflowContext): Promise<void> {
    const transcription = context.state.transcription as Record<string, any>;
    const script = await rewriteScript({
      sourceTranscript: String(transcription?.text ?? ''),
      angle: String(context.input.angle ?? 'educational with unique perspective'),
      tone: String(context.input.tone ?? 'engaging')
    });
    context.state.script = script;
    context.logs.push('Script rewritten');
  }
}
