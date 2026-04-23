import { Router } from "express";
import fs from "node:fs/promises";
import path from "node:path";
import { workerPost } from "../services/pythonBridge.js";
import { geminiService } from "../services/geminiService.js";

const dataDir = path.resolve(process.cwd(), "data", "competitor");

async function saveAnalysis(analysisId: string, payload: unknown) {
  await fs.mkdir(dataDir, { recursive: true });
  await fs.writeFile(path.join(dataDir, `${analysisId}.json`), JSON.stringify(payload, null, 2), "utf-8");
}

async function loadAnalysis(analysisId: string) {
  const content = await fs.readFile(path.join(dataDir, `${analysisId}.json`), "utf-8");
  return JSON.parse(content);
}

export const competitorRouter = Router();

competitorRouter.post("/analyze", async (req, res) => {
  try {
    const { videoUrl, localVideoPath } = req.body;
    if (!videoUrl && !localVideoPath) return res.status(400).json({ error: "videoUrl or localVideoPath is required" });

    const source = videoUrl
      ? await workerPost<{ localPath: string; metadata: Record<string, unknown> }>("/worker/download-video", { url: videoUrl })
      : { localPath: localVideoPath as string, metadata: { source: "local_file" } };

    const audio = await workerPost<{ audioPath: string }>("/worker/extract-audio", { videoPath: source.localPath });
    const transcript = await workerPost<{ transcript: string; segments: unknown[] }>("/worker/transcribe", { audioPath: audio.audioPath, language: "auto" });
    const keyframes = await workerPost<{ frameDir: string; frameCount: number; frames: string[] }>("/worker/extract-keyframes", { videoPath: source.localPath, fps: 1 });

    const workerAnalysis = await workerPost<Record<string, unknown>>("/worker/analyze-competitor", {
      videoPath: source.localPath,
      transcript: transcript.transcript,
      metadata: source.metadata
    });

    const analysis = await geminiService.analyzeCompetitor(
      `Analyze this video transcript and keyframe descriptions.\nTranscript: ${transcript.transcript}\nDuration: ${String((source.metadata as { duration?: number }).duration ?? 0)}s\nMetadata: ${JSON.stringify(source.metadata)}\nReturn ONLY JSON:`
    );

    const analysisId = crypto.randomUUID();
    const payload = {
      analysisId,
      metadata: source.metadata,
      localVideoPath: source.localPath,
      transcript: transcript.transcript,
      transcriptSegments: transcript.segments,
      keyframes,
      workerAnalysis,
      analysis
    };
    await saveAnalysis(analysisId, payload);
    res.json(payload);
  } catch (error) {
    res.status(500).json({ error: String(error) });
  }
});

competitorRouter.post("/generate-prompts", async (req, res) => {
  try {
    const { analysisId, sceneCount, creativeDeltaMode = "balanced" } = req.body;
    const analysis = await loadAnalysis(analysisId);
    const creative = await geminiService.creativeDelta(
      `Based on this competitor analysis, create an original, BETTER video concept.\nAnalysis: ${JSON.stringify(analysis)}\nScene count: ${sceneCount}\nCreative mode: ${creativeDeltaMode}.\nOriginality rule: Keep the topic, not the execution.\nReturn ONLY JSON:`
    );
    res.json(creative);
  } catch (error) {
    res.status(500).json({ error: String(error) });
  }
});
