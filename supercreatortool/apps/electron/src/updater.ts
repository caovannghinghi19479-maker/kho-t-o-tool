import { autoUpdater } from "electron-updater";
export function checkForUpdates() { return autoUpdater.checkForUpdatesAndNotify(); }
