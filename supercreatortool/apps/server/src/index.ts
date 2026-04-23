import "dotenv/config";
import express from "express";
import cors from "cors";
import { ensureSettingsRow, prisma } from "./db/prisma.js";
import { projectsRouter } from "./routes/projects.js";
import { jobsRouter } from "./routes/jobs.js";
import { settingsRouter } from "./routes/settings.js";
import { competitorRouter } from "./routes/competitor.js";
import { textToVideoRouter } from "./routes/textToVideo.js";
import { imageToVideoRouter, startEndVideoRouter } from "./routes/imageToVideo.js";
import { ideaToVideoRouter } from "./routes/ideaToVideo.js";
import { characterSyncRouter } from "./routes/characterSync.js";
import { createImageRouter } from "./routes/createImage.js";
import { queueEvents } from "./services/queueManager.js";
import { startJobRunner } from "./services/jobRunner.js";
import { licenseRouter } from "./routes/license.js";

const app = express();
app.use(cors());
app.use(express.json({ limit: "20mb" }));

app.get("/api/health", (_req, res) => res.json({ ok: true }));
app.use("/api/projects", projectsRouter);
app.use("/api/jobs", jobsRouter);
app.use("/api/settings", settingsRouter);
app.use("/api/competitor", competitorRouter);
app.use("/api/text-to-video", textToVideoRouter);
app.use("/api/image-to-video", imageToVideoRouter);
app.use("/api/start-end-video", startEndVideoRouter);
app.use("/api/idea-to-video", ideaToVideoRouter);
app.use("/api/character-sync", characterSyncRouter);
app.use("/api/create-image", createImageRouter);
app.use("/api/license", licenseRouter);

app.get("/api/events", (req, res) => {
  res.setHeader("Content-Type", "text/event-stream");
  res.setHeader("Cache-Control", "no-cache");
  res.setHeader("Connection", "keep-alive");
  const handler = (job: unknown) => res.write(`data: ${JSON.stringify(job)}\n\n`);
  queueEvents.on("job-update", handler);
  req.on("close", () => queueEvents.off("job-update", handler));
});

const port = Number(process.env.PORT || 4000);
ensureSettingsRow().then(() => {
  startJobRunner();
  app.listen(port, () => console.log(`Server listening on :${port}`));
});

process.on("SIGINT", async () => {
  await prisma.$disconnect();
  process.exit(0);
});
