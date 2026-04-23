import { create } from "zustand";
import { api } from "../lib/api";

type Project = { id: string; name: string; description?: string };
interface State { projects: Project[]; load: () => Promise<void>; createProject: (name: string, description?: string) => Promise<void>; }
export const useProjectStore = create<State>((set) => ({
  projects: [],
  load: async () => set({ projects: (await api.get("/projects")).data }),
  createProject: async (name, description) => { await api.post("/projects", { name, description }); set({ projects: (await api.get("/projects")).data }); }
}));
