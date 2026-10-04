import express from 'express';
import helmet from 'helmet';
import cors from 'cors';
import rateLimit from 'express-rate-limit';
import path from 'path';
import { healthRouter } from './routes/health';
import { analyzeRouter } from './routes/analyze';
import { perspectiveRouter } from './routes/perspective';
import { simulateRouter } from './routes/simulate';
import { challengeRouter } from './routes/challenge';
import { reflectRouter } from './routes/reflect';
import { errorHandler } from './middleware/errorHandler';

const app = express();

// ── Security middleware ────────────────────────────────────────────────────────
app.use(helmet());

const allowedOrigins = (process.env.CLIENT_ORIGIN ?? 'http://localhost:5173')
  .split(',')
  .map((o) => o.trim());

app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (e.g. server-to-server, Postman)
      if (!origin) return callback(null, true);
      if (allowedOrigins.includes(origin)) return callback(null, true);
      return callback(new Error(`CORS: origin ${origin} not allowed`));
    },
    methods: ['GET', 'POST', 'DELETE'],
    credentials: true,
  })
);

// ── Body parsing ──────────────────────────────────────────────────────────────
app.use(express.json({ limit: '50kb' }));

// ── Global rate limit ─────────────────────────────────────────────────────────
const windowMs = parseInt(process.env.RATE_LIMIT_WINDOW_MS ?? '900000', 10);
const max = parseInt(process.env.RATE_LIMIT_MAX ?? '100', 10);

app.use(
  rateLimit({
    windowMs,
    max,
    standardHeaders: true,
    legacyHeaders: false,
    message: { error: { code: 'RATE_LIMITED', message: 'Too many requests, please try again later.' } },
  })
);

// ── Routes ────────────────────────────────────────────────────────────────────
app.use('/api/health', healthRouter);
app.use('/api/analyze', analyzeRouter);
app.use('/api/perspective', perspectiveRouter);
app.use('/api/simulate', simulateRouter);
app.use('/api/challenge', challengeRouter);
app.use('/api/reflect', reflectRouter);

// ── Serve client in production ────────────────────────────────────────────────
if (process.env.NODE_ENV === 'production') {
  const clientDist = path.join(__dirname, '../../client/dist');
  app.use(express.static(clientDist));
  app.get('*', (_req, res) => {
    res.sendFile(path.join(clientDist, 'index.html'));
  });
}

// ── Error handler ─────────────────────────────────────────────────────────────
app.use(errorHandler);

export default app;
