import { Router, Request, Response } from 'express';
import { ReflectRequestSchema, ReflectResultSchema, REFLECT_GEMINI_SCHEMA } from '../schemas/challenge';
import { callGemini, isLiveMode } from '../services/gemini';
import { buildReflectPrompt } from '../prompts/challenge';

export const reflectRouter = Router();

reflectRouter.post('/', async (req: Request, res: Response) => {
  const parseResult = ReflectRequestSchema.safeParse(req.body);
  if (!parseResult.success) {
    res.status(400).json({
      error: {
        code: 'VALIDATION_ERROR',
        message: parseResult.error.errors.map((e) => e.message).join('; '),
      },
    });
    return;
  }

  const { decisionContext, history } = parseResult.data;

  if (!isLiveMode()) {
    res.json({
      summary: '[DEMO MODE] Over this session, your thinking evolved from focusing primarily on immediate financial and logistical factors toward a more nuanced consideration of long-term implications.',
      keyInsights: [
        'You recognise that the stipend, while real, may not be the most important factor',
        'Academic impact emerged as an underexplored consideration',
        'The quality of mentorship matters more to you than initially stated',
      ],
      thinkingEvolution: 'You began with a financially-anchored frame and gradually opened to considering learning quality and long-term trajectory.',
      remainingQuestions: ['What specific skills do you expect to gain?', 'Have you spoken with your academic advisor?'],
    });
    return;
  }

  try {
    const prompt = buildReflectPrompt(decisionContext, history);
    const raw = await callGemini<Record<string, unknown>>({
      prompt,
      schema: REFLECT_GEMINI_SCHEMA,
    });

    const validated = ReflectResultSchema.safeParse(raw);
    if (!validated.success) {
      res.json(raw);
      return;
    }

    res.json(validated.data);
  } catch (err) {
    res.status(503).json({
      error: {
        code: 'AI_ERROR',
        message: 'Unable to generate reflection summary. Please try again.',
      },
    });
  }
});
