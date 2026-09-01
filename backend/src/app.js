import express from 'express';
import cors from 'cors';
import apiRouter from './routes/api.js';
import { errorHandler } from './middleware/errorHandler.js';

export function createApp() {
  const app = express();

  app.use(cors({ origin: process.env.FRONTEND_ORIGIN || 'http://localhost:5173' }));
  app.use(express.json());

  app.get('/api/health', (req, res) => {
    res.json({ status: 'ok' });
  });

  app.use('/api', apiRouter);

  app.use(errorHandler);

  return app;
}
