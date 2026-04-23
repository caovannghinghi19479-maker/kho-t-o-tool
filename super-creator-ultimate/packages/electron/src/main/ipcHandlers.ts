import { dialog, ipcMain, shell } from 'electron';
import { BrowserManager } from './browserManager';
import { importCookiesFromJson } from './native/sessionHijacker';

export const registerIpcHandlers = (browserManager: BrowserManager): void => {
  ipcMain.handle('app:selectFolder', async () => {
    const result = await dialog.showOpenDialog({ properties: ['openDirectory', 'createDirectory'] });
    return result.filePaths[0] ?? null;
  });

  ipcMain.handle('app:openExternal', async (_event, url: string) => {
    await shell.openExternal(url);
    return true;
  });

  ipcMain.handle('browser:launchProfile', async (_event, config) => browserManager.launchPersistentProfile(config));

  ipcMain.handle('browser:injectCookies', async (_event, profileId: string, jsonPath?: string) => {
    const cookies = importCookiesFromJson(jsonPath);
    await browserManager.addCookies(profileId, cookies);
    return { injected: cookies.length };
  });

  ipcMain.handle('automation:runGrok', async () => ({ status: 'queued', message: 'Implement in backend automation service.' }));
  ipcMain.handle('automation:runVeo', async () => ({ status: 'queued', message: 'Implement in backend automation service.' }));
  ipcMain.handle('automation:runGeminiInternal', async () => ({ status: 'queued', message: 'Implement in backend automation service.' }));
};
