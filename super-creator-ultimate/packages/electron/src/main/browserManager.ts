import fs from 'node:fs';
import path from 'node:path';
import { chromium, BrowserContext, Cookie } from 'playwright';
import { dataPaths } from './dataPaths';

export interface BrowserProfileConfig {
  profileId: string;
  proxyUrl?: string;
  proxyUsername?: string;
  proxyPassword?: string;
}

interface ManagedProfile {
  context: BrowserContext;
  userDataDir: string;
}

export class BrowserManager {
  private profiles = new Map<string, ManagedProfile>();

  private getProfileDir(profileId: string): string {
    const profileDir = path.join(dataPaths.browserProfilesDir, profileId);
    fs.mkdirSync(profileDir, { recursive: true });
    return profileDir;
  }

  async launchPersistentProfile(config: BrowserProfileConfig): Promise<{ profileId: string; userDataDir: string }> {
    if (this.profiles.has(config.profileId)) {
      return { profileId: config.profileId, userDataDir: this.profiles.get(config.profileId)!.userDataDir };
    }

    const userDataDir = this.getProfileDir(config.profileId);
    const proxy = config.proxyUrl ? { server: config.proxyUrl, username: config.proxyUsername, password: config.proxyPassword } : undefined;
    const context = await chromium.launchPersistentContext(userDataDir, {
      headless: false,
      viewport: { width: 1280, height: 800 },
      proxy,
      args: ['--disable-blink-features=AutomationControlled', '--disable-features=IsolateOrigins,site-per-process']
    });

    this.profiles.set(config.profileId, { context, userDataDir });
    return { profileId: config.profileId, userDataDir };
  }

  async addCookies(profileId: string, cookies: Cookie[]): Promise<void> {
    const managed = this.profiles.get(profileId);
    if (!managed) {
      throw new Error(`Profile ${profileId} is not running`);
    }
    await managed.context.addCookies(cookies);
  }

  async closeProfile(profileId: string): Promise<void> {
    const managed = this.profiles.get(profileId);
    if (!managed) {
      return;
    }
    await managed.context.close();
    this.profiles.delete(profileId);
  }

  async shutdownAll(): Promise<void> {
    await Promise.all([...this.profiles.keys()].map((id) => this.closeProfile(id)));
  }
}
