import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { Cookie } from 'playwright';

export interface ChromeCookie {
  name: string;
  value: string;
  domain: string;
  path: string;
  expires: number;
  httpOnly: boolean;
  secure: boolean;
  sameSite: 'Lax' | 'None' | 'Strict';
}

/**
 * Legitimate cookie importer helper.
 * This function intentionally does not decrypt Chrome encrypted cookie stores.
 * It accepts JSON export files created by the user and maps them to Playwright cookies.
 */
export const importCookiesFromJson = (jsonPath?: string): Cookie[] => {
  const fallback = path.join(os.homedir(), 'Downloads', 'cookies.json');
  const targetPath = jsonPath ?? fallback;

  if (!fs.existsSync(targetPath)) {
    return [];
  }

  const raw = fs.readFileSync(targetPath, 'utf8');
  const parsed = JSON.parse(raw) as ChromeCookie[];

  return parsed.map((cookie) => ({
    name: cookie.name,
    value: cookie.value,
    domain: cookie.domain,
    path: cookie.path ?? '/',
    expires: cookie.expires ?? -1,
    httpOnly: Boolean(cookie.httpOnly),
    secure: Boolean(cookie.secure),
    sameSite: cookie.sameSite ?? 'Lax'
  }));
};
