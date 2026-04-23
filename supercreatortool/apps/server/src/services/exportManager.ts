import fs from "node:fs/promises";
import path from "node:path";

export async function exportPackage(outputDir: string, payload: unknown, filename = "creative-package.json") {
  await fs.mkdir(outputDir, { recursive: true });
  const target = path.join(outputDir, filename);
  await fs.writeFile(target, JSON.stringify(payload, null, 2), "utf-8");
  return target;
}
