import { Router } from "express";
import { prisma } from "../db/prisma.js";

export const imageToVideoRouter = Router();
imageToVideoRouter.post("/", async (req, res) => {
  const { projectId, items, model, aspectRatio } = req.body;
  const jobs = await Promise.all(items.map((item: { imagePath: string; prompt: string }) => prisma.job.create({ data: { projectId, type: "image_to_video", prompt: item.prompt, inputData: JSON.stringify({ imagePath: item.imagePath, model, aspectRatio }) } })));
  res.json({ jobs });
});

export const startEndVideoRouter = Router();
startEndVideoRouter.post("/", async (req, res) => {
  const { projectId, items } = req.body;
  const jobs = await Promise.all(items.map((item: { startImagePath: string; endImagePath: string; prompt?: string }) => prisma.job.create({ data: { projectId, type: "image_to_video", prompt: item.prompt, inputData: JSON.stringify(item) } })));
  res.json({ jobs });
});
