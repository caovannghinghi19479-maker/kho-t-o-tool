import { create } from "zustand";
import { api } from "../lib/api";

interface Settings { geminiApiKey: string; outputDir: string; defaultModel: string; defaultAspect: string; maxRetries: number; maxConcurrent: number; proxyList: string; pythonPath: string; }
interface State { settings: Settings | null; load: () => Promise<void>; save: (patch: Partial<Settings>) => Promise<void>; }
export const useSettingsStore = create<State>((set, get) => ({
  settings: null,
  load: async () => set({ settings: (await api.get("/settings")).data }),
  save: async (patch) => {
    const next = { ...(get().settings ?? {}), ...patch };
    const { data } = await api.put("/settings", next);
    set({ settings: data });
  }
}));
