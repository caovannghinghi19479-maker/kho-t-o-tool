import axios from "axios";

const baseURL = process.env.PYTHON_WORKER_URL ?? "http://127.0.0.1:5001";
const client = axios.create({ baseURL, timeout: 120000 });

export async function workerPost<T>(path: string, payload: unknown): Promise<T> {
  const { data } = await client.post(path, payload);
  if (!data.success) throw new Error(data.error || "Worker call failed");
  return data.data as T;
}
