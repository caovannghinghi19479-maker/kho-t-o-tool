import path from 'node:path';
import { app, BrowserWindow, ipcMain } from 'electron';
import { autoUpdater } from 'electron-updater';
import log from 'electron-log';
import { BrowserManager } from './browserManager';
import { registerIpcHandlers } from './ipcHandlers';
import { ServerManager } from './serverManager';

let mainWindow: BrowserWindow | null = null;
let splashWindow: BrowserWindow | null = null;

const serverManager = new ServerManager();
const browserManager = new BrowserManager();

const createSplashWindow = (): void => {
  splashWindow = new BrowserWindow({
    width: 420,
    height: 240,
    frame: false,
    alwaysOnTop: true,
    center: true,
    backgroundColor: '#0f172a',
    webPreferences: { sandbox: true }
  });
  splashWindow.loadURL('data:text/html,<body style="background:#0f172a;color:#cbd5e1;display:flex;align-items:center;justify-content:center;font-family:sans-serif;">Starting SuperCreatorUltimate...</body>');
};

const createMainWindow = (): void => {
  mainWindow = new BrowserWindow({
    width: 1280,
    height: 800,
    minWidth: 1024,
    minHeight: 680,
    backgroundColor: '#0f172a',
    autoHideMenuBar: true,
    webPreferences: {
      preload: path.join(__dirname, '..', 'preload', 'index.js'),
      contextIsolation: true,
      nodeIntegration: false
    }
  });

  const rendererUrl = process.env.RENDERER_URL ?? 'http://localhost:5173';
  void mainWindow.loadURL(rendererUrl);
};

const setupAutoUpdater = (): void => {
  autoUpdater.logger = log;
  autoUpdater.autoDownload = false;
  autoUpdater.checkForUpdatesAndNotify().catch((err) => log.error('update-check-failed', err));

  ipcMain.handle('app:getVersion', () => app.getVersion());
  ipcMain.handle('app:checkUpdates', async () => autoUpdater.checkForUpdates());
};

app.whenReady().then(async () => {
  createSplashWindow();
  registerIpcHandlers(browserManager);
  setupAutoUpdater();

  const monorepoRoot = path.resolve(__dirname, '..', '..', '..', '..');
  serverManager.startAll(monorepoRoot);
  const health = await serverManager.waitUntilHealthy();

  if (!health.backendReady || !health.workerReady) {
    splashWindow?.webContents.executeJavaScript('document.body.innerText = "Server startup failed. Check logs.";');
    return;
  }

  createMainWindow();
  splashWindow?.close();
  splashWindow = null;
});

app.on('window-all-closed', async () => {
  await browserManager.shutdownAll();
  serverManager.stopAll();
  if (process.platform !== 'darwin') {
    app.quit();
  }
});
