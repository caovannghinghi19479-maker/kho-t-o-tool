import fs from 'node:fs';
import path from 'node:path';

const BASE_DIR = process.env.SUPER_CREATOR_DATA_DIR ?? 'E:/SuperCreatorData';

export interface DataPaths {
  baseDir: string;
  browserProfilesDir: string;
  mediaDir: string;
  pythonVenvDir: string;
  whisperModelsDir: string;
  tempDir: string;
  logsDir: string;
  electronUserDataDir: string;
}

export const dataPaths: DataPaths = {
  baseDir: BASE_DIR,
  browserProfilesDir: path.join(BASE_DIR, 'browser-profiles'),
  mediaDir: path.join(BASE_DIR, 'media'),
  pythonVenvDir: path.join(BASE_DIR, 'python-venv'),
  whisperModelsDir: path.join(BASE_DIR, 'whisper-models'),
  tempDir: path.join(BASE_DIR, 'temp'),
  logsDir: path.join(BASE_DIR, 'logs'),
  electronUserDataDir: path.join(BASE_DIR, 'electron-userdata')
};

export const ensureDataDirectories = (): void => {
  Object.values(dataPaths).forEach((dir) => fs.mkdirSync(dir, { recursive: true }));
};
