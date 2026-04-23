import { spawn, ChildProcess } from "node:child_process";
import path from "node:path";

let serverProc: ChildProcess | undefined;
let workerProc: ChildProcess | undefined;

export function startServices() {
  const root = path.resolve(process.cwd());
  serverProc = spawn("npm", ["--workspace", "apps/server", "run", "dev"], { cwd: root, stdio: "inherit", shell: true });
  workerProc = spawn("python", ["workers/main.py"], { cwd: root, stdio: "inherit" });
}

export function stopServices() {
  serverProc?.kill();
  workerProc?.kill();
}
