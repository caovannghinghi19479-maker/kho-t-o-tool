import { Router } from "express";
import { prisma } from "../db/prisma.js";

export const createImageRouter = Router();
createImageRouter.post("/", async (req, res) => {
  const { projectId, prompts, referenceImages, model } = req.body;
  const jobs = await Promise.all(prompts.map((prompt: string, idx: number) => prisma.job.create({ data: { projectId, type: "create_image", prompt, inputData: JSON.stringify({ model, referenceImage: referenceImages?.[idx] }) } })));
  res.json({ jobs });
});
