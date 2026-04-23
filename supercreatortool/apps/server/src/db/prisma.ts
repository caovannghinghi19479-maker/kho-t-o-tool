import { PrismaClient } from "@prisma/client";

export const prisma = new PrismaClient();

export async function ensureSettingsRow() {
  await prisma.settings.upsert({
    where: { id: "singleton" },
    create: { id: "singleton" },
    update: {}
  });
}
