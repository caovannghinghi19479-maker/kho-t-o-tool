export class PipelineOrchestrator {
  constructor(private workerBaseUrl = process.env.WORKER_URL ?? 'http://127.0.0.1:8001') {}

  async callWorker<T>(path: string, payload: unknown): Promise<T> {
    const response = await fetch(`${this.workerBaseUrl}${path}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });

    if (!response.ok) {
      const detail = await response.text();
      throw new Error(`Worker call failed ${response.status}: ${detail}`);
    }

    return (await response.json()) as T;
  }
}
