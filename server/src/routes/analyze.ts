import { Router, Request, Response } from 'express';
import rateLimit from 'express-rate-limit';
import { AnalyzeRequestSchema, AnalysisResultSchema, ANALYSIS_GEMINI_SCHEMA } from '../schemas/analysis';
import { callGemini, isLiveMode, checkForVerdicts, stripVerdicts } from '../services/gemini';
import { getDemoAnalysis } from '../services/demo';
import { buildAnalysisPrompt } from '../prompts/analysis';

export const analyzeRouter = Router();

const analyzeLimit = rateLimit({
  windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS ?? '900000', 10),
  max: parseInt(process.env.ANALYZE_RATE_LIMIT_MAX ?? '20', 10),
  message: { error: { code: 'RATE_LIMITED', message: 'Analysis rate limit reached. Please wait before analyzing again.' } },
});

analyzeRouter.post('/', analyzeLimit, async (req: Request, res: Response) => {
  // Validate request
  const parseResult = AnalyzeRequestSchema.safeParse(req.body);
  if (!parseResult.success) {
    res.status(400).json({
      error: {
        code: 'VALIDATION_ERROR',
        message: parseResult.error.errors.map((e) => e.message).join('; '),
      },
    });
    return;
  }

  const input = parseResult.data;

  // Demo mode
  if (!isLiveMode()) {
    const demo = getDemoAnalysis();
    res.json({ ...demo, mode: 'demo' });
    return;
  }

  try {
    const prompt = buildAnalysisPrompt(input);
    const raw = await callGemini<Record<string, unknown>>({
      prompt,
      schema: ANALYSIS_GEMINI_SCHEMA,
    });

    // Post-process: check for verdict language in text fields
    const jsonStr = JSON.stringify(raw);
    let processedStr = jsonStr;
    if (checkForVerdicts(jsonStr)) {
      processedStr = stripVerdicts(jsonStr);
    }
    const processed = JSON.parse(processedStr) as Record<string, unknown>;

    // Add IDs if missing (Gemini sometimes omits them)
    if (Array.isArray(processed.blindSpots)) {
      processed.blindSpots = (processed.blindSpots as Record<string, unknown>[]).map((bs, i) => ({
        id: `bs-${i + 1}`,
        ...bs,
      }));
    }
    if (Array.isArray(processed.assumptions)) {
      processed.assumptions = (processed.assumptions as Record<string, unknown>[]).map((a, i) => ({
        id: `as-${i + 1}`,
        ...a,
      }));
    }
    if (Array.isArray(processed.riskRadar)) {
      processed.riskRadar = (processed.riskRadar as Record<string, unknown>[]).map((r, i) => ({
        id: `r-${i + 1}`,
        ...r,
      }));
    }
    if (Array.isArray(processed.conflictingPriorities)) {
      processed.conflictingPriorities = (processed.conflictingPriorities as Record<string, unknown>[]).map((cp, i) => ({
        id: `cp-${i + 1}`,
        ...cp,
      }));
    }

    // Validate output
    const validated = AnalysisResultSchema.safeParse({ ...processed, mode: 'live' });
    if (!validated.success) {
      console.error('[analyze] Validation failed:', validated.error.errors);
      // Try to return what we have with mode set
      res.json({ ...processed, mode: 'live' });
      return;
    }

    res.json(validated.data);
  } catch (err) {
    const message = (err as Error).message ?? 'Analysis failed';
    res.status(503).json({
      error: {
        code: 'AI_ERROR',
        message: message.startsWith('AI quota') || message.startsWith('Invalid API')
          ? message
          : 'The AI analysis encountered an issue. Please try again in a moment.',
      },
    });
  }
});
