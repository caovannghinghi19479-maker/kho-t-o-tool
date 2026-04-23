import { ChildProcessWithoutNullStreams, spawn } from 'node:child_process';
import path from 'node:path';

export interface ServerState {
  backendReady: boolean;
  workerReady: boolean;
}

export class ServerManager {
  private backend?: ChildProcessWithoutNullStreams;
  private worker?: ChildProcessWithoutNullStreams;

  startAll(rootDir: string): void {
    this.startBackend(rootDir);
    this.startWorker(rootDir);
  }

  private startBackend(rootDir: string): void {
    const backendEntry = path.join(rootDir, 'packages', 'backend', 'dist', 'index.js');
    this.backend = spawn(process.execPath, [backendEntry], {
      stdio: 'pipe',
      env: {
        ...process.env,
        PORT: process.env.BACKEND_PORT ?? '8787'
      }
    });

    this.backend.stdout.on('data', (data) => console.log(`[backend] ${data}`.trim()));
    this.backend.stderr.on('data', (data) => console.error(`[backend] ${data}`.trim()));
  }

  private startWorker(rootDir: string): void {
    const workerEntry = path.join(rootDir, 'packages', 'worker', 'main.py');
    this.worker = spawn('python', [workerEntry], {
      stdio: 'pipe',
      env: {
        ...process.env,
        WORKER_PORT: process.env.WORKER_PORT ?? '8001'
      }
    });

    this.worker.stdout.on('data', (data) => console.log(`[worker] ${data}`.trim()));
    this.worker.stderr.on('data', (data) => console.error(`[worker] ${data}`.trim()));
  }

  async waitUntilHealthy(timeoutMs = 30000): Promise<ServerState> {
    const startedAt = Date.now();
    const backendUrl = `http://127.0.0.1:${process.env.BACKEND_PORT ?? '8787'}/health`;
    const workerUrl = `http://127.0.0.1:${process.env.WORKER_PORT ?? '8001'}/worker/health`;

    const check = async (url: string): Promise<boolean> => {
      try {
        const response = await fetch(url);
        return response.ok;
      } catch {
        return false;
      }
    };

    while (Date.now() - startedAt < timeoutMs) {
      const [backendReady, workerReady] = await Promise.all([check(backendUrl), check(workerUrl)]);
      if (backendReady && workerReady) {
        return { backendReady, workerReady };
      }
      await new Promise((resolve) => setTimeout(resolve, 1000));
    }

    return {
      backendReady: false,
      workerReady: false
    };
  }

  stopAll(): void {
    this.backend?.kill();
    this.worker?.kill();
  }
}
