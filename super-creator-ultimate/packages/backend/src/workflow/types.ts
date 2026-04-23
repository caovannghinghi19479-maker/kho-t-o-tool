export interface WorkflowContext {
  workflowId: string;
  input: Record<string, unknown>;
  state: Record<string, unknown>;
  logs: string[];
}

export interface WorkflowNode {
  name: string;
  run(context: WorkflowContext): Promise<void>;
}
