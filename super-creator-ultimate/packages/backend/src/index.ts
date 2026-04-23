import cors from 'cors';
import express from 'express';
import pino from 'pino';
import automationRouter from './routes/automation';
import creativeRouter from './routes/creative';
import jobsRouter from './routes/jobs';
import licenseRouter from './routes/license';
import postRouter from './routes/post';
import profilesRouter from './routes/profiles';
import researchRouter from './routes/research';
import workflowRouter from './routes/workflow';
import youtubeRouter from './routes/youtube';

const logger = pino({ name: 'supercreator-backend' });
const app = express();

app.use(cors());
app.use(express.json({ limit: '20mb' }));

app.get('/health', (_req, res) => {
  res.json({ status: 'ok', service: 'backend', at: new Date().toISOString() });
});

app.use('/api/license', licenseRouter);
app.use('/api/profiles', profilesRouter);
app.use('/api/automation', automationRouter);
app.use('/api/jobs', jobsRouter);
app.use('/api/research', researchRouter);
app.use('/api/creative', creativeRouter);
app.use('/api/workflow', workflowRouter);
app.use('/api/post', postRouter);
app.use('/api/youtube', youtubeRouter);

const port = Number(process.env.PORT ?? 8787);
app.listen(port, () => {
  logger.info(`Backend API listening on http://127.0.0.1:${port}`);
});
