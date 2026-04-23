import { create } from "zustand";
import { api } from "../lib/api";

type Job = {
  id: string;
  type: string;
  status: string;
  prompt?: string;
  progress: number;
  error?: string | null;
};

interface State {
  jobs: Job[];
  load: () => Promise<void>;
  subscribeToEvents: () => () => void;
}

export const useJobStore = create<State>((set, get) => ({
  jobs: [],
  load: async () => set({ jobs: (await api.get("/jobs")).data }),
  subscribeToEvents: () => {
    const es = new EventSource("http://localhost:4000/api/events");
    es.onmessage = (event) => {
      const update = JSON.parse(event.data) as Job;
      const existing = get().jobs;
      const found = existing.find((j) => j.id === update.id);
      if (!found) {
        set({ jobs: [update, ...existing] });
        return;
      }
      set({ jobs: existing.map((j) => (j.id === update.id ? { ...j, ...update } : j)) });
    };
    es.onerror = () => es.close();
    return () => es.close();
  }
}));
