import { contextBridge, ipcRenderer } from "electron";

contextBridge.exposeInMainWorld("superCreator", {
  selectFolder: () => ipcRenderer.invoke("dialog:select-folder"),
  selectFiles: () => ipcRenderer.invoke("dialog:select-files"),
  selectVideo: () => ipcRenderer.invoke("dialog:select-video"),
  openPath: (path: string) => ipcRenderer.invoke("shell:open-path", path),
  getVersion: () => ipcRenderer.invoke("app:get-version"),
  checkForUpdates: () => ipcRenderer.invoke("app:check-for-updates")
});
