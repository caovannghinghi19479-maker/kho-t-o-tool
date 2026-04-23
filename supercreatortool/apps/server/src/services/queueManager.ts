import { EventEmitter } from "node:events";

export const queueEvents = new EventEmitter();

export function emitJobUpdate(job: unknown) {
  queueEvents.emit("job-update", job);
}
