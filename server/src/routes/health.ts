import { Router } from 'express';
import { isLiveMode } from '../services/gemini';

export const healthRouter = Router();

healthRouter.get('/', (_req, res) => {
  res.json({
    status: 'ok',
    mode: isLiveMode() ? 'live' : 'demo',
    model: process.env.GEMINI_MODEL ?? 'gemini-2.5-flash',
    timestamp: new Date().toISOString(),
  });
});
