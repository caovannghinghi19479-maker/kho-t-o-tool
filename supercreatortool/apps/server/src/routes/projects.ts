import { Router } from "express";
import fs from "node:fs/promises";
import path from "node:path";
import { prisma } from "../db/prisma.js";

const rootDataDir = path.resolve(process.cwd(), "data", "projects");

export const projectsRouter = Router();

projectsRouter.get("/", async (_req, res) => {
  const projects = await prisma.project.findMany({ orderBy: { createdAt: "desc" }, include: { jobs: true } });
  res.json(projects);
});

projectsRouter.post("/", async (req, res) => {
  const project = await prisma.project.create({ data: { name: req.body.name, description: req.body.description } });
  await fs.mkdir(path.join(rootDataDir, project.id), { recursive: true });
  await fs.writeFile(
    path.join(rootDataDir, project.id, "project.json"),
    JSON.stringify({ id: project.id, name: project.name, description: project.description, createdAt: project.createdAt }, null, 2),
    "utf-8"
  );
  res.json(project);
});

projectsRouter.get("/:id", async (req, res) =>
  res.json(await prisma.project.findUnique({ where: { id: req.params.id }, include: { jobs: true, artifacts: true } }))
);

projectsRouter.put("/:id", async (req, res) => {
  const updated = await prisma.project.update({ where: { id: req.params.id }, data: req.body });
  await fs.mkdir(path.join(rootDataDir, updated.id), { recursive: true });
  await fs.writeFile(
    path.join(rootDataDir, updated.id, "project.json"),
    JSON.stringify({ id: updated.id, name: updated.name, description: updated.description, updatedAt: updated.updatedAt }, null, 2),
    "utf-8"
  );
  res.json(updated);
});

projectsRouter.delete("/:id", async (req, res) => {
  await prisma.project.delete({ where: { id: req.params.id } });
  res.json({ ok: true });
});
