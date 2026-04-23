import { Router } from "express";
import { prisma } from "../db/prisma.js";
import { getSecret, setSecret } from "../services/secretStore.js";

export const settingsRouter = Router();

settingsRouter.get("/", async (_req, res) => {
  const settings = await prisma.settings.findUnique({ where: { id: "singleton" } });
  const geminiApiKey = await getSecret("geminiApiKey");
  res.json({ ...settings, geminiApiKey: geminiApiKey ? "********" : "" });
});

settingsRouter.put("/", async (req, res) => {
  const { geminiApiKey, ...safeData } = req.body;
  if (typeof geminiApiKey === "string" && geminiApiKey.trim()) {
    await setSecret("geminiApiKey", geminiApiKey.trim());
  }
  const updated = await prisma.settings.update({ where: { id: "singleton" }, data: safeData });
  res.json({ ...updated, geminiApiKey: (await getSecret("geminiApiKey")) ? "********" : "" });
});
