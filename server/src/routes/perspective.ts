import { Router, Request, Response } from 'express';
import { PerspectiveRequestSchema, PerspectiveResultSchema, PERSPECTIVE_GEMINI_SCHEMA } from '../schemas/perspective';
import { callGemini, isLiveMode } from '../services/gemini';
import { buildPerspectivePrompt } from '../prompts/perspective';

export const perspectiveRouter = Router();

perspectiveRouter.post('/', async (req: Request, res: Response) => {
  const parseResult = PerspectiveRequestSchema.safeParse(req.body);
  if (!parseResult.success) {
    res.status(400).json({
      error: {
        code: 'VALIDATION_ERROR',
        message: parseResult.error.errors.map((e) => e.message).join('; '),
      },
    });
    return;
  }

  const { perspective, decisionContext } = parseResult.data;

  if (!isLiveMode()) {
    // Demo perspective
    res.json({
      perspective,
      lensSummary: `[DEMO MODE] This is a simulated ${perspective} viewpoint for demonstration purposes.`,
      considerations: ['Consider the long-term implications', 'Weigh the immediate vs future benefits', 'Think about your core values'],
      overlookedFactors: ['The opportunity cost of alternatives', 'The non-financial aspects of this choice'],
      concerns: ['Ensure this aligns with your broader goals', 'Consider seeking additional information'],
      criticalQuestions: ['What matters most to you in 5 years?', 'What would you regret not exploring?', 'Who else does this decision affect?'],
    });
    return;
  }

  try {
    const prompt = buildPerspectivePrompt(perspective, decisionContext);
    const raw = await callGemini<Record<string, unknown>>({
      prompt,
      schema: PERSPECTIVE_GEMINI_SCHEMA,
    });

    const validated = PerspectiveResultSchema.safeParse(raw);
    if (!validated.success) {
      res.json({ ...raw, perspective });
      return;
    }

    res.json(validated.data);
  } catch (err) {
    res.status(503).json({
      error: {
        code: 'AI_ERROR',
        message: 'Unable to generate perspective. Please try again.',
      },
    });
  }
});
