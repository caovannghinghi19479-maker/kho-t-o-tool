import { Router } from 'express';
import { z } from 'zod';
import { workflowEngine } from '../workflow/WorkflowEngine';

const router = Router();

router.post('/execute', async (req, res) => {
  const parsed = z
    .object({
      url: z.string().url(),
      angle: z.string().optional(),
      tone: z.string().optional(),
      topic: z.string().optional(),
      targetSeconds: z.number().int().min(15).max(180).optional()
    })
    .safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: parsed.error.flatten() });

  const run = await workflowEngine.execute(parsed.data);
  return res.status(202).json(run);
});

router.get('/status/:id', (req, res) => {
  const status = workflowEngine.getStatus(req.params.id);
  if (!status) return res.status(404).json({ error: 'Workflow not found' });
  return res.json(status);
});

export default router;
