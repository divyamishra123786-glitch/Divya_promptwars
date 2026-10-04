import { Router, Request, Response } from 'express';
import { SimulateRequestSchema, SimulateResultSchema, SIMULATE_GEMINI_SCHEMA } from '../schemas/simulate';
import { callGemini, isLiveMode } from '../services/gemini';
import { buildSimulatePrompt } from '../prompts/simulate';

export const simulateRouter = Router();

simulateRouter.post('/', async (req: Request, res: Response) => {
  const parseResult = SimulateRequestSchema.safeParse(req.body);
  if (!parseResult.success) {
    res.status(400).json({
      error: {
        code: 'VALIDATION_ERROR',
        message: parseResult.error.errors.map((e) => e.message).join('; '),
      },
    });
    return;
  }

  const { originalContext, hypotheticals } = parseResult.data;
  const activeHypotheticals = hypotheticals.filter((h) => h.active);

  if (activeHypotheticals.length === 0) {
    res.status(400).json({
      error: {
        code: 'VALIDATION_ERROR',
        message: 'Please activate at least one hypothetical condition to simulate.',
      },
    });
    return;
  }

  if (!isLiveMode()) {
    res.json({
      summary: '[DEMO MODE] This is a simulated what-if analysis. In live mode, Gemini would analyze how these hypothetical changes shift the decision landscape.',
      shiftedRisks: [
        { risk: 'Financial pressure', change: 'increased', explanation: 'The stipend reduction could change the financial calculus significantly.' },
        { risk: 'Learning opportunity', change: 'decreased', explanation: 'Without mentorship, skill development may be limited to self-directed learning.' },
      ],
      brokenAssumptions: ['That the financial compensation offsets the opportunity cost', 'That sufficient mentorship will be available'],
      newQuestions: ['Would you still find value in this opportunity without the financial benefit?', 'What self-learning resources would be available?'],
      overallImpact: 'High',
    });
    return;
  }

  try {
    const prompt = buildSimulatePrompt(originalContext, activeHypotheticals);
    const raw = await callGemini<Record<string, unknown>>({
      prompt,
      schema: SIMULATE_GEMINI_SCHEMA,
    });

    const validated = SimulateResultSchema.safeParse(raw);
    if (!validated.success) {
      res.json(raw);
      return;
    }

    res.json(validated.data);
  } catch (err) {
    res.status(503).json({
      error: {
        code: 'AI_ERROR',
        message: 'Unable to run simulation. Please try again.',
      },
    });
  }
});
