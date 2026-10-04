import 'dotenv/config';
import app from './app';

const PORT = parseInt(process.env.PORT ?? '8787', 10);

app.listen(PORT, () => {
  const mode = process.env.GEMINI_API_KEY ? 'LIVE AI' : 'DEMO MODE';
  console.log(`[BlindSpot AI] Server running on port ${PORT} — ${mode}`);
});
