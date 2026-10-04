import { GoogleGenAI } from '@google/genai';
import { jsonrepair } from 'jsonrepair';

const MODEL = process.env.GEMINI_MODEL ?? 'gemini-2.5-flash';
let client: GoogleGenAI | null = null;

function getClient(): GoogleGenAI {
  if (!client) {
    const key = process.env.GEMINI_API_KEY;
    if (!key) throw new Error('GEMINI_API_KEY not set');
    client = new GoogleGenAI({ apiKey: key });
  }
  return client;
}

export function isLiveMode(): boolean {
  return Boolean(process.env.GEMINI_API_KEY);
}

// Verdict language check – strip any decision-making language
const VERDICT_PATTERNS = [
  /\byou should (accept|reject|choose|pick|take|go with|avoid|not take)\b/gi,
  /\b(best|worst) option\b/gi,
  /\bi (recommend|suggest|advise) (you )?(to )?(accept|reject|choose|take|go with)\b/gi,
  /\bmy recommendation\b/gi,
];

export function checkForVerdicts(text: string): boolean {
  return VERDICT_PATTERNS.some((p) => p.test(text));
}

export function stripVerdicts(text: string): string {
  let result = text;
  for (const p of VERDICT_PATTERNS) {
    result = result.replace(p, '[perspective removed]');
  }
  return result;
}

interface GeminiCallOptions {
  prompt: string;
  schema?: Record<string, unknown>;
  maxRetries?: number;
}

export async function callGemini<T = unknown>({
  prompt,
  schema,
  maxRetries = 3,
}: GeminiCallOptions): Promise<T> {
  const ai = getClient();
  let lastError: Error = new Error('Unknown error');

  for (let attempt = 0; attempt < maxRetries; attempt++) {
    try {
      const config: Record<string, unknown> = {
        temperature: 0.7,
      };

      if (schema) {
        config.responseMimeType = 'application/json';
        config.responseSchema = schema;
      }

      const response = await ai.models.generateContent({
        model: MODEL,
        contents: prompt,
        config,
      });

      const text = response.text ?? '';

      // Try to parse JSON response
      if (schema) {
        try {
          return JSON.parse(text) as T;
        } catch {
          // Try JSON repair
          try {
            const repaired = jsonrepair(text);
            return JSON.parse(repaired) as T;
          } catch {
            throw new Error('Failed to parse AI response as JSON');
          }
        }
      }

      return text as T;
    } catch (err) {
      lastError = err as Error;
      const message = lastError.message ?? '';

      // Check for quota/rate limit errors
      if (message.includes('429') || message.includes('quota') || message.includes('RESOURCE_EXHAUSTED')) {
        throw new Error('AI quota exceeded. Please wait a moment and try again.');
      }

      // Don't retry on auth errors
      if (message.includes('401') || message.includes('403') || message.includes('API_KEY')) {
        throw new Error('Invalid API key. Please check your GEMINI_API_KEY.');
      }

      if (attempt < maxRetries - 1) {
        // Exponential backoff
        await new Promise((r) => setTimeout(r, Math.pow(2, attempt) * 1000));
      }
    }
  }

  throw lastError;
}
