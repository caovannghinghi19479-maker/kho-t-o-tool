import { BrowserWindow, dialog } from "electron";

export function createMainWindow(isDev: boolean) {
  const win = new BrowserWindow({
    width: 1280,
    height: 800,
    minWidth: 1024,
    minHeight: 680,
    title: "SuperCreatorTool",
    backgroundColor: "#0f172a",
    autoHideMenuBar: true,
    webPreferences: { preload: new URL("./preload.js", import.meta.url).pathname, contextIsolation: true, nodeIntegration: false }
  });
  win.on("close", async (e) => {
    const { response } = await dialog.showMessageBox(win, { type: "question", buttons: ["Cancel", "Quit"], message: "Close SuperCreatorTool?" });
    if (response === 0) e.preventDefault();
  });
  if (isDev) {
    win.loadURL("http://localhost:5173");
    win.webContents.openDevTools();
  } else {
    win.loadFile("../../renderer/dist/index.html");
  }
  return win;
}
