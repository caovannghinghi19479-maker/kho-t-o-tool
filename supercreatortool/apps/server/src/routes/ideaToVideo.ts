import { Router } from "express";
import { geminiService } from "../services/geminiService.js";
import { prisma } from "../db/prisma.js";

export const ideaToVideoRouter = Router();
ideaToVideoRouter.post("/", async (req, res) => {
  const { projectId, idea, sceneCount, style, language, model } = req.body;
  const prompt = `You are a creative director. Expand this idea into ${sceneCount} video scenes.\nIdea: ${idea}\nStyle: ${style}\nLanguage: ${language}\nReturn ONLY JSON:`;
  const scenePlan = await geminiService.expandIdea(prompt);
  const jobs = await Promise.all((scenePlan.scenes || []).map((scene: { veo3Prompt: string }) => prisma.job.create({ data: { projectId, type: "text_to_video", prompt: scene.veo3Prompt, inputData: JSON.stringify({ model, source: "idea_to_video" }) } })));
  res.json({ scenePlan, jobs });
});
