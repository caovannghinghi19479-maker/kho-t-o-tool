import fs from "node:fs/promises";
import path from "node:path";
import { prisma } from "../db/prisma.js";
import { emitJobUpdate } from "./queueManager.js";

let timer: NodeJS.Timeout | undefined;
const running = new Set<string>();

async function persistJobArtifact(jobId: string, projectId: string, output: Record<string, unknown>) {
  const targetDir = path.resolve(process.cwd(), "data", "projects", projectId, "jobs");
  await fs.mkdir(targetDir, { recursive: true });
  const filePath = path.join(targetDir, `${jobId}.json`);
  await fs.writeFile(filePath, JSON.stringify(output, null, 2), "utf-8");
  await prisma.artifact.create({
    data: {
      projectId,
      type: output.type === "create_image" ? "image" : "video",
      filePath,
      metadata: JSON.stringify({ jobId })
    }
  });
  return filePath;
}

async function processJob(jobId: string) {
  const job = await prisma.job.findUnique({ where: { id: jobId } });
  if (!job || job.status !== "running") return;
  try {
    for (const progress of [10, 30, 60, 85, 100]) {
      await prisma.job.update({ where: { id: job.id }, data: { progress } });
      emitJobUpdate({ id: job.id, status: "running", progress });
      await new Promise((r) => setTimeout(r, 350));
    }

    const parsedInput = job.inputData ? JSON.parse(job.inputData) : {};
    const output = {
      generatedAt: new Date().toISOString(),
      type: job.type,
      prompt: job.prompt,
      input: parsedInput,
      resultPath: `project://${job.projectId}/${job.id}`
    };
    const artifactPath = await persistJobArtifact(job.id, job.projectId, output);
    const updated = await prisma.job.update({
      where: { id: job.id },
      data: { status: "done", progress: 100, outputData: JSON.stringify({ ...output, artifactPath }), error: null }
    });
    emitJobUpdate(updated);
  } catch (error) {
    const settings = await prisma.settings.findUnique({ where: { id: "singleton" } });
    const maxRetries = settings?.maxRetries ?? 3;
    const nextRetry = job.retryCount + 1;
    const data =
      nextRetry <= maxRetries
        ? { status: "pending", retryCount: nextRetry, error: String(error), progress: 0 }
        : { status: "failed", retryCount: nextRetry, error: String(error) };
    const failed = await prisma.job.update({ where: { id: job.id }, data });
    emitJobUpdate(failed);
  } finally {
    running.delete(jobId);
  }
}

export function startJobRunner() {
  if (timer) return;
  timer = setInterval(async () => {
    const settings = await prisma.settings.findUnique({ where: { id: "singleton" } });
    const maxConcurrent = settings?.maxConcurrent ?? 2;
    if (running.size >= maxConcurrent) return;

    const jobs = await prisma.job.findMany({
      where: { status: "pending" },
      orderBy: { createdAt: "asc" },
      take: maxConcurrent - running.size
    });

    for (const job of jobs) {
      running.add(job.id);
      const started = await prisma.job.update({ where: { id: job.id }, data: { status: "running", progress: 1 } });
      emitJobUpdate(started);
      void processJob(job.id);
    }
  }, 1000);
}

export function stopJobRunner() {
  if (timer) clearInterval(timer);
}
