import { Router } from "express";
import { prisma } from "../db/prisma.js";

export const textToVideoRouter = Router();
textToVideoRouter.post("/", async (req, res) => {
  const { projectId, prompts, model, aspectRatio, outputDir } = req.body;
  const jobs = await Promise.all(prompts.map((prompt: string) => prisma.job.create({ data: { projectId, type: "text_to_video", prompt, inputData: JSON.stringify({ model, aspectRatio, outputDir }) } })));
  res.json({ jobs });
});
