import { Router } from "express";
import { prisma } from "../db/prisma.js";

export const jobsRouter = Router();
jobsRouter.get("/", async (req, res) => {
  const { projectId, status, type } = req.query;
  res.json(await prisma.job.findMany({ where: { projectId: projectId as string | undefined, status: status as string | undefined, type: type as string | undefined }, orderBy: { createdAt: "desc" } }));
});
jobsRouter.post("/", async (req, res) => res.json(await prisma.job.create({ data: req.body })));
jobsRouter.get("/:id", async (req, res) => res.json(await prisma.job.findUnique({ where: { id: req.params.id } })));
jobsRouter.post("/:id/cancel", async (req, res) => res.json(await prisma.job.update({ where: { id: req.params.id }, data: { status: "cancelled" } })));
jobsRouter.post("/:id/retry", async (req, res) => res.json(await prisma.job.update({ where: { id: req.params.id }, data: { status: "pending", retryCount: 0, error: null, progress: 0 } })));
jobsRouter.delete("/:id", async (req, res) => {
  await prisma.job.delete({ where: { id: req.params.id } });
  res.json({ ok: true });
});
jobsRouter.post("/cancel-all", async (_req, res) => {
  const result = await prisma.job.updateMany({ where: { status: { in: ["pending", "running"] } }, data: { status: "cancelled" } });
  res.json(result);
});
