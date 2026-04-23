import crypto from 'node:crypto';
import os from 'node:os';
import { Router } from 'express';
import { z } from 'zod';
import { prisma } from '../lib/prisma';

const router = Router();

const bodySchema = z.object({ key: z.string().min(6) });

const machineId = (): string =>
  crypto
    .createHash('sha256')
    .update(`${os.hostname()}${os.cpus()[0]?.model ?? 'cpu'}${os.totalmem()}`)
    .digest('hex');

router.post('/validate', async (req, res) => {
  const parseResult = bodySchema.safeParse(req.body);
  if (!parseResult.success) {
    return res.status(400).json({ error: parseResult.error.flatten() });
  }

  const currentMachineId = machineId();
  const { key } = parseResult.data;
  const license = await prisma.license.findUnique({ where: { key } });

  if (!license || license.status !== 'ACTIVE') {
    return res.status(403).json({ valid: false, reason: 'License inactive or missing.' });
  }

  if (license.expiresAt && license.expiresAt.getTime() < Date.now()) {
    return res.status(403).json({ valid: false, reason: 'License expired.' });
  }

  if (!license.machineId) {
    await prisma.license.update({ where: { id: license.id }, data: { machineId: currentMachineId } });
    return res.json({ valid: true, machineId: currentMachineId, bound: true });
  }

  if (license.machineId !== currentMachineId) {
    return res.status(403).json({ valid: false, reason: 'License belongs to another machine.' });
  }

  return res.json({ valid: true, machineId: currentMachineId, bound: false });
});

export default router;
