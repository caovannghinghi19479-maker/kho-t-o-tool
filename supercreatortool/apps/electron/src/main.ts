import { app } from "electron";
import { createMainWindow } from "./windowManager.js";
import { registerIpcHandlers } from "./ipcHandlers.js";
import { startServices, stopServices } from "./serverManager.js";

const isDev = !app.isPackaged;

app.whenReady().then(() => {
  startServices();
  registerIpcHandlers();
  createMainWindow(isDev);
});

app.on("window-all-closed", () => {
  stopServices();
  if (process.platform !== "darwin") app.quit();
});
