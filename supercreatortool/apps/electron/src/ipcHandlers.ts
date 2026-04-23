import { app, dialog, ipcMain, shell } from "electron";
import { checkForUpdates } from "./updater.js";

export function registerIpcHandlers() {
  ipcMain.handle("dialog:select-folder", async () => {
    const result = await dialog.showOpenDialog({ properties: ["openDirectory"] });
    return result.filePaths[0] ?? null;
  });
  ipcMain.handle("dialog:select-files", async () => {
    const result = await dialog.showOpenDialog({ properties: ["openFile", "multiSelections"] });
    return result.filePaths;
  });
  ipcMain.handle("dialog:select-video", async () => {
    const result = await dialog.showOpenDialog({ properties: ["openFile"], filters: [{ name: "Videos", extensions: ["mp4", "mov", "mkv", "webm"] }] });
    return result.filePaths[0] ?? null;
  });
  ipcMain.handle("shell:open-path", async (_evt, path: string) => shell.openPath(path));
  ipcMain.handle("app:get-version", () => app.getVersion());
  ipcMain.handle("app:check-for-updates", () => checkForUpdates());
}
