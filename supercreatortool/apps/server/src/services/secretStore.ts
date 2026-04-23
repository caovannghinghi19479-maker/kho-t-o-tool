import fs from "node:fs/promises";
import os from "node:os";
import path from "node:path";

const secretDir = path.join(os.homedir(), ".supercreatortool");
const secretFile = path.join(secretDir, "secrets.json");

type SecretMap = Record<string, string>;

async function readFileSecrets(): Promise<SecretMap> {
  try {
    const content = await fs.readFile(secretFile, "utf-8");
    return JSON.parse(content) as SecretMap;
  } catch {
    return {};
  }
}

async function writeFileSecrets(secrets: SecretMap) {
  await fs.mkdir(secretDir, { recursive: true });
  await fs.writeFile(secretFile, JSON.stringify(secrets, null, 2), { encoding: "utf-8", mode: 0o600 });
}

export async function getSecret(key: string): Promise<string> {
  const secrets = await readFileSecrets();
  return secrets[key] ?? "";
}

export async function setSecret(key: string, value: string): Promise<void> {
  const secrets = await readFileSecrets();
  secrets[key] = value;
  await writeFileSecrets(secrets);
}
