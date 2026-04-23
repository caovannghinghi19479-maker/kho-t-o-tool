import { contextBridge, ipcRenderer } from 'electron';

const api = {
  selectFolder: (): Promise<string | null> => ipcRenderer.invoke('app:selectFolder'),
  openExternal: (url: string): Promise<boolean> => ipcRenderer.invoke('app:openExternal', url),
  getVersion: (): Promise<string> => ipcRenderer.invoke('app:getVersion'),
  checkUpdates: (): Promise<unknown> => ipcRenderer.invoke('app:checkUpdates'),
  launchProfile: (config: unknown): Promise<unknown> => ipcRenderer.invoke('browser:launchProfile', config),
  injectCookies: (profileId: string, jsonPath?: string): Promise<unknown> =>
    ipcRenderer.invoke('browser:injectCookies', profileId, jsonPath),
  runGrok: (payload: unknown): Promise<unknown> => ipcRenderer.invoke('automation:runGrok', payload),
  runVeo: (payload: unknown): Promise<unknown> => ipcRenderer.invoke('automation:runVeo', payload),
  runGeminiInternal: (payload: unknown): Promise<unknown> => ipcRenderer.invoke('automation:runGeminiInternal', payload)
};

contextBridge.exposeInMainWorld('superCreatorApi', api);
