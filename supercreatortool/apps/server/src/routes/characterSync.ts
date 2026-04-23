import { Router } from "express";
import { prisma } from "../db/prisma.js";

export const characterSyncRouter = Router();
characterSyncRouter.post("/", async (req, res) => {
  const { projectId, characters, prompts } = req.body;
  const map = new Map(characters.map((c: { name: string; imagePath: string }) => [c.name, c.imagePath]));
  const jobs = await Promise.all(prompts.map((p: string) => {
    const names = [...p.matchAll(/\{([^}]+)\}/g)].map((m) => m[1]);
    const images = names.map((n) => ({ name: n, imagePath: map.get(n) }));
    return prisma.job.create({ data: { projectId, type: "character_sync", prompt: p, inputData: JSON.stringify({ images }) } });
  }));
  res.json({ jobs });
});
