import { buildPromptChain } from '../../services/creative/promptChain';
import { buildStoryboard } from '../../services/creative/storyboard';
import { WorkflowContext, WorkflowNode } from '../types';

export class StoryboardNode implements WorkflowNode {
  name = 'StoryboardNode';

  async run(context: WorkflowContext): Promise<void> {
    const script = String(context.state.script ?? '');
    const storyboard = buildStoryboard(script);
    const prompts = buildPromptChain(storyboard);
    context.state.storyboard = storyboard;
    context.state.prompts = prompts;
    context.logs.push('Storyboard and prompt chain generated');
  }
}
